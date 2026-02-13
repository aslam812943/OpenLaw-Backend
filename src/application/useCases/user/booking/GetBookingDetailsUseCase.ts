import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IGetBookingDetailsUseCase } from "../../../interface/use-cases/user/IGetBookingDetailsUseCase";
import { ResponseGetAppointmentsDTO } from "../../../dtos/user/ResponseGetAppointments";
import { UserAppointmentsMapper } from "../../../mapper/user/userAppoimentsMapper";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(bookingId: string): Promise<ResponseGetAppointmentsDTO> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        const mapped = UserAppointmentsMapper.mapToDto([booking]);
        return mapped[0];
    }
}
