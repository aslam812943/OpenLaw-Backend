import { IGetAppointmentDetailsUseCase } from "../../interface/use-cases/lawyer/IGetAppointmentDetailsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ResponseGetAppoimnetsDTO } from "../../dtos/lawyer/ResponseGetAppoimentsDTO";
import { AppoimentMapper } from "../../mapper/lawyer/AppoimentMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetAppointmentDetailsUseCase implements IGetAppointmentDetailsUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(bookingId: string): Promise<ResponseGetAppoimnetsDTO> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        const mapped = AppoimentMapper.toDTO([booking]);
        return mapped[0];
    }
}
