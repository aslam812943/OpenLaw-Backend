import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetUserAppointmentsUseCase } from "../../interface/use-cases/user/IGetUserAppointmentsUseCase";
import { ResponseGetAppointments } from "../../dtos/user/ResponseGetAppointments";
import { UserAppointmentsMapper } from "../../mapper/user/userAppoimentsMapper";
import { BookingSearchDTO } from "../../dtos/common/BookingSearchDTO";

export class GetUserAppointmentsUseCase implements IGetUserAppointmentsUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(userId: string, searchDTO: BookingSearchDTO): Promise<{ appointments: ResponseGetAppointments[], total: number }> {
        const { bookings, total } = await this._bookingRepository.findByUserId(
            userId,
            searchDTO.page,
            searchDTO.limit,
            searchDTO.status,
            searchDTO.search,
            searchDTO.date
        );

        return {
            appointments: UserAppointmentsMapper.mapToDto(bookings),
            total
        };
    }
}
