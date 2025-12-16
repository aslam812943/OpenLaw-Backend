import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ICancelAppointmentUseCase } from "../../interface/use-cases/user/ICancelAppointmentUseCase";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(bookingId: string, reason: string): Promise<void> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }
       
        await this.bookingRepository.updateStatus(bookingId, "cancelled", reason);
    }
}
