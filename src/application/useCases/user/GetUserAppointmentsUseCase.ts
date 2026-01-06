import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetUserAppointmentsUseCase } from "../../interface/use-cases/user/IGetUserAppointmentsUseCase";
import { ResponseGetAppointments } from "../../dtos/user/ResponseGetAppointments";
import { UserAppointmentsMapper } from "../../mapper/user/userAppoimentsMapper";

export class GetUserAppointmentsUseCase implements IGetUserAppointmentsUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(userId: string, page: number = 1, limit: number = 10): Promise<{ appointments: ResponseGetAppointments[], total: number }> {
        const { bookings, total } = await this.bookingRepository.findByUserId(userId, page, limit);

        return {
            appointments: UserAppointmentsMapper.mapToDto(bookings),
            total
        };
    }
}
