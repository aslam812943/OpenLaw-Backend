import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class UpdateAppointmentStatusUseCase {
    constructor(
        private _repository: IAvailabilityRuleRepository,
        private _bookingRepository: IBookingRepository,
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _chatRoomRepository: IChatRoomRepository
    ) { }

    async execute(id: string, status: string): Promise<void> {
        if (!id || !status) {
            throw new BadRequestError("Appointment ID and status are required.");
        }

        const booking = await this._bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError("Appointment not found.");
        }

        if (status === 'rejected') {
            if (booking.paymentStatus === 'paid' && booking.paymentId) {
                await this._paymentService.refundPayment(booking.paymentId, booking.consultationFee);
                await this._bookingRepository.updateStatus(id, 'rejected', undefined, {
                    amount: booking.consultationFee,
                    status: 'full'
                });
            } else {
                await this._bookingRepository.updateStatus(id, 'rejected');
            }

            await this._repository.cancelSlot(booking.startTime, booking.lawyerId, booking.date);
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

            await this._bookingRepository.updateStatus(id, 'completed');


            const lawyer = await this._lawyerRepository.findById(booking.lawyerId);
            let commissionPercent = 10;

            if (lawyer && (lawyer as any).subscriptionId) {
                const subscription = await this._subscriptionRepository.findById((lawyer as any).subscriptionId.toString());
                if (subscription) {
                    commissionPercent = subscription.commissionPercent;
                }
            }

            const commissionAmount = booking.consultationFee * (commissionPercent / 100);
            const netAmount = booking.consultationFee - commissionAmount;

            await this._lawyerRepository.updateWalletBalance(booking.lawyerId, netAmount);
        } else {
            await this._bookingRepository.updateStatus(id, status);
        }

        
        await this._chatRoomRepository.syncChatRoom(booking.userId, booking.lawyerId, this._bookingRepository);
    }
}
