import mongoose from "mongoose";
import { IAutoCancelExpiredBookingsUseCase } from "../../interface/use-cases/common/IAutoCancelExpiredBookingsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";

export class AutoCancelExpiredBookingsUseCase implements IAutoCancelExpiredBookingsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _lawyerRepository: ILawyerRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _adminRepository: IAdminRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase,
        private readonly _paymentService: IPaymentService,
        private readonly _chatRoomRepository: IChatRoomRepository,
        private readonly _messageRepository: IMessageRepository,
        private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
    ) { }

    async execute(): Promise<void> {
        const { bookings } = await this._bookingRepository.findAll(1, 100, 'pending');

        const now = new Date();

        for (const booking of bookings) {
            try {
                const expiryDate = new Date(booking.date);
                const [time, modifier] = booking.endTime.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                expiryDate.setHours(hours, minutes, 0, 0);

                if (expiryDate < now) {
                    await this.processRejection(booking);
                }
            } catch (error) {
                console.error(`Error processing auto-cancellation for booking ${booking.id}:`, error);
            }
        }
    }

    private async processRejection(booking: any): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const appointmentId = booking.id;
            const lawyer = await this._lawyerRepository.findById(booking.lawyerId);

            if (booking.paymentStatus === 'paid') {
                if (booking.paymentId === 'WALLET_PAYMENT' || booking.stripeSessionId === 'WALLET') {
                    await this._walletRepository.addTransaction(booking.userId.toString(), booking.consultationFee, {
                        type: 'credit',
                        amount: booking.consultationFee,
                        date: new Date(),
                        status: 'completed',
                        bookingId: appointmentId,
                        description: `Refund: Appointment expired (No response from Lawyer)`,
                        metadata: {
                            reason: 'Automatic cancellation due to non-response',
                            lawyerName: lawyer?.name,
                            lawyerId: booking.lawyerId.toString(),
                            date: booking.date,
                            time: booking.startTime,
                            displayId: booking.bookingId
                        }
                    }, session);
                } else if (booking.paymentId) {
                    await this._paymentService.refundPayment(booking.paymentId, booking.consultationFee);


                    await this._walletRepository.addTransaction(booking.userId.toString(), booking.consultationFee, {
                        type: 'credit',
                        amount: booking.consultationFee,
                        date: new Date(),
                        status: 'completed',
                        bookingId: appointmentId,
                        description: `Refund: Appointment expired (No response from Lawyer)`,
                        metadata: {
                            reason: 'Automatic cancellation due to non-response',
                            lawyerName: lawyer?.name,
                            lawyerId: booking.lawyerId.toString(),
                            date: booking.date,
                            time: booking.startTime,
                            displayId: booking.bookingId
                        }
                    }, session);
                }

                let penaltyAmount = 0;
                if (lawyer?.subscriptionId) {
                    const subscription = await this._subscriptionRepository.findById(lawyer.subscriptionId.toString());
                    if (subscription && subscription.lawyerCancellationPenaltyPercent > 0) {
                        penaltyAmount = (booking.consultationFee * subscription.lawyerCancellationPenaltyPercent) / 100;
                    }
                }

                await this._bookingRepository.updateStatus(appointmentId, 'rejected', 'Expired: No response from lawyer', {
                    amount: booking.consultationFee,
                    status: 'full'
                }, undefined, session, penaltyAmount);

                if (penaltyAmount > 0) {
                    await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), -penaltyAmount, session);
                    await this._adminRepository.updateWalletBalance(penaltyAmount, session);
                    await this._walletRepository.addTransaction(booking.lawyerId.toString(), -penaltyAmount, {
                        type: 'debit',
                        amount: penaltyAmount,
                        date: new Date(),
                        status: 'completed',
                        bookingId: appointmentId,
                        description: `Penalty: Appointment expired (No response)`,
                        metadata: {
                            displayId: booking.bookingId,
                            reason: "Non-response to booking request"
                        }
                    }, session);

                    await this._sendNotificationUseCase.execute(
                        booking.lawyerId.toString(),
                        `A penalty of ₹${penaltyAmount.toFixed(2)} has been deducted for failing to respond to appointment ${booking.bookingId} before it expired.`,
                        'CANCELLATION_PENALTY',
                        { appointmentId, penaltyAmount }
                    );
                }
            } else {
                await this._bookingRepository.updateStatus(appointmentId, 'rejected', 'Expired: No response from lawyer', undefined, undefined, session);
            }

            await this._sendNotificationUseCase.execute(
                booking.userId.toString(),
                `Your appointment (${booking.bookingId}) has been automatically cancelled as the lawyer did not respond in time. Full refund has been processed.`,
                'APPOINTMENT_REJECTED',
                { appointmentId }
            );

            await this._availabilityRuleRepository.cancelSlot(booking.startTime, booking.lawyerId.toString(), booking.date);

            try {
                const chatRoom = await this._chatRoomRepository.findByBookingId(appointmentId);
                if (chatRoom && chatRoom.id) {
                    await this._messageRepository.deleteByRoomId(chatRoom.id);
                    await this._chatRoomRepository.deleteByBookingId(appointmentId);
                }
            } catch (error) {
                console.error("Error deleting chat room during auto-rejection:", error);
            }

            await session.commitTransaction();
            console.log(`Auto-cancelled expired booking ${booking.bookingId}`);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
