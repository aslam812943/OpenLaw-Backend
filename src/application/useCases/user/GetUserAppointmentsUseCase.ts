import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetUserAppointmentsUseCase } from "../../interface/use-cases/user/IGetUserAppointmentsUseCase";
import { Booking } from "../../../domain/entities/Booking";
import { ResponseGetAppoiments } from "../../dtos/user/ResponseGetAppoiments";
import { UserAppointmentsMapper } from "../../mapper/user/userAppoimentsMapper";

export class GetUserAppointmentsUseCase implements IGetUserAppointmentsUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(userId: string, page: number = 1, limit: number = 10): Promise<{ appointments: ResponseGetAppoiments[], total: number }> {
        const { bookings, total } = await this.bookingRepository.findByUserId(userId, page, limit);

        return {
            appointments: UserAppointmentsMapper.mapToDto(bookings),
            total
        };
    }
}
