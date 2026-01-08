import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IChatRoomRepository } from "../../../domain/repositories/IChatRoomRepository";
import { ICancelAppointmentUseCase } from "../../interface/use-cases/user/ICancelAppointmentUseCase";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
    constructor(
        private bookingRepository: IBookingRepository,
        private _slotRepo: IAvailabilityRuleRepository,
        private _paymentService: IPaymentService,
        private _lawyerRepo: ILawyerRepository,
        private _chatRoomRepository: IChatRoomRepository
    ) { }

    async execute(bookingId: string, reason: string): Promise<void> {
        const booking = await this.bookingRepository.findById(bookingId);
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


            if (booking.status === 'completed') {
                await this._lawyerRepo.updateWalletBalance(booking.lawyerId, -refundAmount);
            }
        }

        await this.bookingRepository.updateStatus(bookingId, "cancelled", reason, {
            amount: refundAmount,
            status: refundStatus
        });
        await this._slotRepo.cancelSlot(booking.startTime, booking.lawyerId, booking.date);

    
        await this._chatRoomRepository.syncChatRoom(booking.userId, booking.lawyerId, this.bookingRepository);
    }
}
