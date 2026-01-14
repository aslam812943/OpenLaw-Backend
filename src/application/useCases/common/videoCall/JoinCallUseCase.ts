import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IJoinCallUseCase } from "../../../interface/use-cases/common/IJoinCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class JoinCallUseCase implements IJoinCallUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(bookingId: string): Promise<void> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        await this._bookingRepository.updateCallStatus(bookingId, true, true);
    }
}
