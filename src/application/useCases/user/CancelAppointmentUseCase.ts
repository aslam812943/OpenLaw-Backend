import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ICancelAppointmentUseCase } from "../../interface/use-cases/user/ICancelAppointmentUseCase";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IDatabaseSessionFactory } from "../../../domain/interfaces/IDatabaseSession";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _slotRepository: IAvailabilityRuleRepository,
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _walletRepository: IWalletRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _chatRoomRepository: IChatRoomRepository,
        private _messageRepository: IMessageRepository,
        private _adminRepository: IAdminRepository,
        private _sessionFactory: IDatabaseSessionFactory
    ) { }

    async execute(bookingId: string, reason: string): Promise<void> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.status === 'cancelled') {
            throw new BadRequestError("Booking is already cancelled");
        }


        const appointmentDate = new Date(booking.date);
        const [time, modifier] = booking.startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        appointmentDate.setHours(hours, minutes, 0, 0);

        const now = new Date();


        if (appointmentDate < now) {
            throw new BadRequestError("Cannot cancel an appointment that has already passed.");
        }


        if (booking.status === 'completed' || booking.status === 'rejected') {
            throw new BadRequestError(`Cannot cancel a booking that is already ${booking.status}.`);
        }

        const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        let refundAmount = 0;
        let refundStatus: 'full' | 'partial' = 'full';


        if (hoursUntilAppointment >= 48) {
            refundAmount = booking.consultationFee;
            refundStatus = 'full';
        } else {

            refundAmount = booking.consultationFee * 0.7;
            refundStatus = 'partial';
        }

        const dbSession = await this._sessionFactory.createSession();
        await dbSession.startTransaction();

        try {
            const session = dbSession.getSession();
            if (booking.paymentStatus === 'paid' && booking.paymentId) {
                await this._paymentService.refundPayment(booking.paymentId, refundAmount);

                const lawyer = await this._lawyerRepository.findById(booking.lawyerId);

                await this._walletRepository.addTransaction(booking.userId, refundAmount, {
                    type: 'credit',
                    amount: refundAmount,
                    date: new Date(),
                    status: 'completed',
                    bookingId: bookingId,
                    description: `Refund for appointment with ${lawyer?.name || 'Lawyer'} - Cancelled by User`,
                    metadata: {
                        reason: reason,
                        lawyerName: lawyer?.name,
                        lawyerId: booking.lawyerId,
                        date: booking.date,
                        time: booking.startTime,
                        displayId: booking.bookingId
                    }
                }, session);


                if (refundStatus === 'partial') {
                    const retainedAmount = booking.consultationFee - refundAmount;
                    const commissionPercent = booking.commissionPercent || 0;

                    const adminShare = retainedAmount * (commissionPercent / 100);
                    const lawyerShare = retainedAmount - adminShare;

                    await this._lawyerRepository.updateWalletBalance(booking.lawyerId, lawyerShare, session);
                    await this._adminRepository.updateWalletBalance(adminShare, session);

                    await this._sendNotificationUseCase.execute(
                        booking.lawyerId,
                        `You have received ₹${lawyerShare.toFixed(2)} as a cancellation fee share for appointment ${booking.bookingId}.`,
                        'WALLET_CREDIT',
                        { appointmentId: bookingId, amount: lawyerShare }
                    );
                }
            }

            await this._bookingRepository.updateStatus(bookingId, "cancelled", reason, {
                amount: refundAmount,
                status: refundStatus
            }, undefined, session);

            if (refundAmount > 0) {
                await this._sendNotificationUseCase.execute(
                    booking.userId,
                    `Your appointment (${booking.bookingId}) has been cancelled. A refund of ₹${refundAmount} has been credited to your wallet.`,
                    'WALLET_REFUND',
                    { appointmentId: bookingId, amount: refundAmount }
                );
            }

            await this._sendNotificationUseCase.execute(
                booking.lawyerId,
                `User cancelled appointment (${booking.bookingId}) for ${booking.date} at ${booking.startTime}. Reason: ${reason}`,
                'APPOINTMENT_CANCELLED',
                { appointmentId: bookingId }
            );

            await this._slotRepository.cancelSlot(booking.startTime, booking.lawyerId, booking.date, session);

            try {
                const chatRoom = await this._chatRoomRepository.findByBookingId(bookingId);
                if (chatRoom && chatRoom.id) {
                    await this._messageRepository.deleteByRoomId(chatRoom.id);
                    await this._chatRoomRepository.deleteByBookingId(bookingId);
                }
            } catch (error) {
            }

            await dbSession.commitTransaction();
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }
    }
}
