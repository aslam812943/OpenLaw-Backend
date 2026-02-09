import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ICancelAppointmentUseCase } from "../../interface/use-cases/user/ICancelAppointmentUseCase";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _slotRepository: IAvailabilityRuleRepository,
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _walletRepository: IWalletRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase
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
        const createdAt = booking.createdAt || now;
        const timeSinceBooking = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        let refundAmount = 0;
        let refundStatus: 'full' | 'partial' = 'full';

        if (diffInHours >= 24 || timeSinceBooking < 24) {
            refundAmount = booking.consultationFee;
            refundStatus = 'full';
        } else {
            refundAmount = booking.consultationFee * 0.5;
            refundStatus = 'partial';
        }


        if (booking.paymentStatus === 'paid' && booking.paymentId) {
            await this._paymentService.refundPayment(booking.paymentId, refundAmount);

            const lawyer = await this._lawyerRepository.findById(booking.lawyerId);

            // Credit user wallet
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
            });


            if (booking.status === 'completed') {
                await this._lawyerRepository.updateWalletBalance(booking.lawyerId, -refundAmount);
            }
        }

        await this._bookingRepository.updateStatus(bookingId, "cancelled", reason, {
            amount: refundAmount,
            status: refundStatus
        });

        // Notify User about refund
        if (refundAmount > 0) {
            await this._sendNotificationUseCase.execute(
                booking.userId,
                `Your appointment (${booking.bookingId}) has been cancelled. A refund of ₹${refundAmount} has been credited to your wallet.`,
                'WALLET_REFUND',
                { appointmentId: bookingId, amount: refundAmount }
            );
        }

        // Notify Lawyer about cancellation
        await this._sendNotificationUseCase.execute(
            booking.lawyerId,
            `User cancelled appointment (${booking.bookingId}) for ${booking.date} at ${booking.startTime}. Reason: ${reason}`,
            'APPOINTMENT_CANCELLED',
            { appointmentId: bookingId }
        );

        await this._slotRepository.cancelSlot(booking.startTime, booking.lawyerId, booking.date);


    }
}
