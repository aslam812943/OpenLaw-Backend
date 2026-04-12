import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { IUpdateAppointmentStatusUseCase } from "../../interface/use-cases/lawyer/IUpdateAppointmentStatusUseCase";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";

export class UpdateAppointmentStatusUseCase implements IUpdateAppointmentStatusUseCase {
    constructor(
        private readonly _repository: IAvailabilityRuleRepository,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _paymentService: IPaymentService,
        private readonly _lawyerRepository: ILawyerRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase,
        private readonly _chatRoomRepository: IChatRoomRepository,
        private readonly _messageRepository: IMessageRepository,
        private readonly _adminRepository: IAdminRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(appointmentId: string, status: string, feedback?: string): Promise<void> {
        if (!appointmentId || !status) {
            throw new BadRequestError("Appointment ID and status are required.");
        }

        const booking = await this._bookingRepository.findById(appointmentId);
        if (!booking) {
            throw new NotFoundError("Appointment not found.");
        }

        if (status === 'rejected') {
            if (booking.paymentStatus === 'paid') {
                const lawyer = await this._lawyerRepository.findById(booking.lawyerId);

                if (booking.paymentId === 'WALLET_PAYMENT' || booking.stripeSessionId === 'WALLET') {

                    await this._walletRepository.addTransaction(booking.userId, booking.consultationFee, {
                        type: 'credit',
                        amount: booking.consultationFee,
                        date: new Date(),
                        status: 'completed',
                        bookingId: appointmentId,
                        description: `Refund for appointment with ${lawyer?.name || 'Lawyer'} - Lawyer Rejected`,
                        metadata: {
                            reason: feedback || 'Lawyer rejected the appointment',
                            lawyerName: lawyer?.name,
                            lawyerId: booking.lawyerId.toString(),
                            date: booking.date,
                            time: booking.startTime,
                            displayId: booking.bookingId
                        }
                    });
                } else if (booking.paymentId) {

                    await this._paymentService.refundPayment(booking.paymentId, booking.consultationFee);
                }

                await this._bookingRepository.updateStatus(appointmentId, 'rejected', undefined, {
                    amount: booking.consultationFee,
                    status: 'full'
                });


                if (lawyer?.subscriptionId) {
                    const subscription = await this._subscriptionRepository.findById(lawyer.subscriptionId.toString());
                    if (subscription && subscription.lawyerCancellationPenaltyPercent > 0) {
                        const penaltyAmount = (booking.consultationFee * subscription.lawyerCancellationPenaltyPercent) / 100;

                        if (penaltyAmount > 0) {

                            await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), -penaltyAmount);


                            await this._adminRepository.updateWalletBalance(penaltyAmount);


                            await this._walletRepository.addTransaction(booking.lawyerId.toString(), -penaltyAmount, {
                                type: 'debit',
                                amount: penaltyAmount,
                                date: new Date(),
                                status: 'completed',
                                bookingId: appointmentId,
                                description: `Cancellation penalty for appointment ${booking.bookingId}`,
                                metadata: {
                                    displayId: booking.bookingId,
                                    reason: "Lawyer cancelled the booking"
                                }
                            });


                            await this._sendNotificationUseCase.execute(
                                booking.lawyerId.toString(),
                                `A penalty of ₹${penaltyAmount.toFixed(2)} (${subscription.lawyerCancellationPenaltyPercent}%) has been deducted from your wallet for cancelling appointment ${booking.bookingId}.`,
                                'CANCELLATION_PENALTY',
                                { appointmentId, penaltyAmount }
                            );
                        }
                    }
                }
            } else {
                await this._bookingRepository.updateStatus(appointmentId, 'rejected');
            }

            await this._sendNotificationUseCase.execute(
                booking.userId.toString(),
                `Your appointment (${booking.bookingId}) with the lawyer has been rejected. ${feedback ? `Reason: ${feedback}` : ''}. ${booking.paymentStatus === 'paid' ? 'A refund has been initiated.' : ''}`,
                'APPOINTMENT_REJECTED',
                { appointmentId }
            );


            if (booking.paymentStatus === 'paid' && (booking.paymentId === 'WALLET_PAYMENT' || booking.stripeSessionId === 'WALLET')) {
                await this._sendNotificationUseCase.execute(
                    booking.userId.toString(),
                    `A refund of ₹${booking.consultationFee} for appointment ${booking.bookingId} has been added to your wallet.`,
                    'WALLET_REFUND',
                    { appointmentId, amount: booking.consultationFee }
                );
            }

            await this._repository.cancelSlot(booking.startTime, booking.lawyerId.toString(), booking.date);

            try {
                const chatRoom = await this._chatRoomRepository.findByBookingId(appointmentId);
                if (chatRoom && chatRoom.id) {
                    await this._messageRepository.deleteByRoomId(chatRoom.id);
                    await this._chatRoomRepository.deleteByBookingId(appointmentId);
                }
            } catch (error) {
                console.error("Error deleting chat room during rejection:", error);
            }
        } else if (status === 'completed') {
            const currentStatus = booking.status;
            if (currentStatus !== 'confirmed') {
                throw new BadRequestError("Only confirmed appointments can be marked as completed.");
            }


            const appointmentDate = new Date(booking.date);
            const [time, modifier] = booking.startTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            appointmentDate.setHours(hours, minutes, 0, 0);

            if (appointmentDate > new Date()) {
                throw new BadRequestError("Cannot mark a future appointment as completed.");
            }

            await this._bookingRepository.updateStatus(appointmentId, 'completed', undefined, undefined, feedback);

            await this._sendNotificationUseCase.execute(
                booking.userId.toString(),
                `Your consultation ${booking.bookingId} has been marked as completed. Please leave a review!`,
                'APPOINTMENT_COMPLETED',
                { appointmentId }
            );


            await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), booking.consultationFee);
            await this._walletRepository.addTransaction(booking.lawyerId.toString(), booking.consultationFee, {
                type: 'credit',
                amount: booking.consultationFee,
                date: new Date(),
                status: 'completed',
                bookingId: appointmentId,
                description: `Consultation fee for ${booking.bookingId}`,
                metadata: {
                    displayId: booking.bookingId,
                    date: booking.date,
                    time: booking.startTime
                }
            });


            const commissionPercent = booking.commissionPercent || 0;
            if (commissionPercent > 0) {
                const commissionAmount = booking.consultationFee * (commissionPercent / 100);


                await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), -commissionAmount);
                await this._walletRepository.addTransaction(booking.lawyerId.toString(), -commissionAmount, {
                    type: 'debit',
                    amount: commissionAmount,
                    date: new Date(),
                    status: 'completed',
                    bookingId: appointmentId,
                    description: `Platform commission for ${booking.bookingId} (${commissionPercent}%)`,
                    metadata: {
                        displayId: booking.bookingId
                    }
                });


                await this._adminRepository.updateWalletBalance(commissionAmount);
            }

        } else {
            await this._bookingRepository.updateStatus(appointmentId, status);

            if (status === 'confirmed') {
                await this._sendNotificationUseCase.execute(
                    booking.userId,
                    `Good news! Your appointment ${booking.bookingId} has been confirmed by the lawyer.`,
                    'APPOINTMENT_CONFIRMED',
                    { appointmentId }
                );
            }
        }


    }
}
