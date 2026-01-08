import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IJoinCallUseCase } from "../../../interface/use-cases/common/IJoinCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class JoinCallUseCase implements IJoinCallUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(bookingId: string): Promise<void> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        await this.bookingRepository.updateCallStatus(bookingId, true, true);
    }
}
