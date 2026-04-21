import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IEndCallUseCase } from "../../../interface/use-cases/common/IEndCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class EndCallUseCase implements IEndCallUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(bookingId: string): Promise<void> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

       
        await this._bookingRepository.updateCallStatus(bookingId, false, false);
    }
}
