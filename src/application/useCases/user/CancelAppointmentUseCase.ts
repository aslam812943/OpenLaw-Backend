import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ICancelAppointmentUseCase } from "../../interface/use-cases/user/ICancelAppointmentUseCase";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
    constructor(private bookingRepository: IBookingRepository, private _slotRepo: IAvailabilityRuleRepository) { }

    async execute(bookingId: string, reason: string): Promise<void> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }
    
        await this.bookingRepository.updateStatus(bookingId, "cancelled", reason);
        await this._slotRepo.cancelSlot(booking.startTime, booking.lawyerId, booking.date)
    }
}
