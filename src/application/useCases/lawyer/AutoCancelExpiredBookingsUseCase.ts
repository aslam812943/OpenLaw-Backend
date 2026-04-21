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
import { IDatabaseSessionFactory } from "../../../domain/interfaces/IDatabaseSession";
import logger from "../../../infrastructure/logging/logger";

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
        private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
        private readonly _sessionFactory: IDatabaseSessionFactory
    ) { }

    async execute(): Promise<void> {

        await this.processCollection('pending', async (booking) => {
            const now = new Date();
            const expiryDate = this.getBookingEndDate(booking);
            if (expiryDate < now) {
                await this.processRejection(booking, "Expired: No response from lawyer");
            }
        });

        // Handle Confirmed Bookings (24h warning and 48h auto-rejection)
        const statusesToCleanup = ['confirmed'];
        for (const status of statusesToCleanup) {
            await this.processCollection(status, async (booking) => {
                const now = new Date();
                const endDate = this.getBookingEndDate(booking);

                // 48h Auto-Rejection
                const fortyEightHoursLater = new Date(endDate.getTime() + 48 * 60 * 60 * 1000);
                if (now > fortyEightHoursLater) {
                    await this.processRejection(booking, `Lawyer failed to mark as completed within 48h (${status})`);
                    return;
                }

                // 24h Warning
                const twentyFourHoursLater = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
                if (now > twentyFourHoursLater && !booking.isWarningSent) {
                    try {
                        await this._sendNotificationUseCase.execute(
                            booking.lawyerId.toString(),
                            `Reminder: You have less than 24 hours to mark appointment ${booking.bookingId} as completed to avoid penalties.`,
                            'APPOINTMENT_COMPLETION_REMINDER',
                            { appointmentId: booking.id }
                        );
                        await this._bookingRepository.updateWarningStatus(booking.id, true);
                        logger.info(`Sent 24h completion warning for booking ${booking.bookingId}`);
                    } catch (error) {
                        logger.error(`Error sending 24h warning for booking ${booking.bookingId}:`, error);
                    }
                }
            });
        }

        // Handle Follow-up Bookings (Auto-completion if user doesn't respond)
        await this.processCollection('follow-up', async (booking) => {
            const now = new Date();
            let expiryDate: Date | null = null;

            if (booking.followUpType === 'specific' && booking.followUpDate && booking.followUpTime) {
                expiryDate = this.getFollowUpDateTime(booking.followUpDate, booking.followUpTime);
            } else if (booking.followUpType === 'deadline' && booking.followUpDate) {
                
                expiryDate = new Date(booking.followUpDate);
                expiryDate.setHours(23, 59, 59, 999);
            }

            if (expiryDate && now > expiryDate) {
                await this._bookingRepository.updateStatus(booking.id, 'completed');
                logger.info(`Auto-completed expired follow-up booking ${booking.bookingId}`);

             
                try {
                    await this._sendNotificationUseCase.execute(
                        booking.lawyerId.toString(),
                        `Appointment ${booking.bookingId} has been automatically marked as completed as the follow-up request expired.`,
                        'APPOINTMENT_COMPLETED',
                        { appointmentId: booking.id }
                    );
                } catch (error) {
                    logger.error(`Error sending follow-up completion notification for booking ${booking.bookingId}:`, error);
                }
            }
        });
    }

    private getFollowUpDateTime(dateStr: string, timeStr: string): Date {
        const date = new Date(dateStr);
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    private async processCollection(status: string, processor: (booking: any) => Promise<void>): Promise<void> {
        let page = 1;
        const limit = 50;
        let hasMore = true;

        while (hasMore) {
            try {
                const { bookings, total } = await this._bookingRepository.findAll(page, limit, status);
                if (bookings.length === 0) {
                    hasMore = false;
                    break;
                }

                for (const booking of bookings) {
                    try {
                        await processor(booking);
                    } catch (error) {
                        logger.error(`Error processing booking ${booking.id} (${status}):`, error);
                    }
                }

                if (page * limit >= total) {
                    hasMore = false;
                } else {

                    page++;
                }
            } catch (error) {
                logger.error(`Error fetching bookings for status ${status}:`, error);
                hasMore = false;
            }
        }
    }

    private getBookingEndDate(booking: any): Date {
        const endDate = new Date(booking.date);
        const [time, modifier] = booking.endTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        endDate.setHours(hours, minutes, 0, 0);
        return endDate;
    }

    private async processRejection(booking: any, reason: string): Promise<void> {
        const dbSession = await this._sessionFactory.createSession();
        await dbSession.startTransaction();

        try {
            const session = dbSession.getSession();
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
                        description: `Refund: Appointment expired (${reason})`,
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
                    try {
                        await this._paymentService.refundPayment(booking.paymentId, booking.consultationFee);
                    } catch (refundError) {

                        logger.error(`Stripe refund failed for booking ${booking.bookingId}:`, refundError);
                    }

                    await this._walletRepository.addTransaction(booking.userId.toString(), booking.consultationFee, {
                        type: 'credit',
                        amount: booking.consultationFee,
                        date: new Date(),
                        status: 'completed',
                        bookingId: appointmentId,
                        description: `Refund: Appointment expired (${reason})`,
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

                await this._bookingRepository.updateStatus(appointmentId, 'rejected', reason, {
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
                        description: `Penalty: Appointment expired (${reason})`,
                        metadata: {
                            displayId: booking.bookingId,
                            reason: "Non-response or failure to complete"
                        }
                    }, session);

                    try {
                        await this._sendNotificationUseCase.execute(
                            booking.lawyerId.toString(),
                            `A penalty of ₹${penaltyAmount.toFixed(2)} has been deducted for appointment ${booking.bookingId} due to non-response/completion.`,
                            'CANCELLATION_PENALTY',
                            { appointmentId, penaltyAmount }
                        );
                    } catch (notifErr) {
                        logger.error(`Error sending penalty notification for booking ${booking.bookingId}:`, notifErr);
                    }
                }
            } else {
                await this._bookingRepository.updateStatus(appointmentId, 'rejected', reason, undefined, undefined, session);
            }

            try {
                await this._sendNotificationUseCase.execute(
                    booking.userId.toString(),
                    `Your appointment (${booking.bookingId}) has been automatically cancelled as the lawyer did not respond in time. Full refund has been processed.`,
                    'APPOINTMENT_REJECTED',
                    { appointmentId }
                );
            } catch (notifErr) {
                logger.error(`Error sending user rejection notification for booking ${booking.bookingId}:`, notifErr);
            }


            try {
                await this._availabilityRuleRepository.cancelSlot(booking.startTime, booking.lawyerId.toString(), booking.date, session);
            } catch (slotErr) {
                logger.warn(`Failed to cancel slot for booking ${booking.bookingId}: ${slotErr instanceof Error ? slotErr.message : slotErr}`);
            }

            try {
                const chatRoom = await this._chatRoomRepository.findByBookingId(appointmentId);
                if (chatRoom && chatRoom.id) {
                    await this._messageRepository.deleteByRoomId(chatRoom.id);
                    await this._chatRoomRepository.deleteByBookingId(appointmentId);
                }
            } catch (error) {
                logger.error("Error deleting chat room during auto-rejection:", error);
            }

            await dbSession.commitTransaction();
            logger.info(`Auto-cancelled expired booking ${booking.bookingId} (${reason})`);
        } catch (error) {
            await dbSession.abortTransaction();
            logger.error(`Transaction failed for auto-rejection of booking ${booking.id}:`, error);
            throw error;
        } finally {
            dbSession.endSession();
        }
    }
}
