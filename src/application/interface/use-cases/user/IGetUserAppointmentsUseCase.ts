import { ResponseGetAppointments } from "../../../dtos/user/ResponseGetAppointments";
import { BookingSearchDTO } from "../../../dtos/common/BookingSearchDTO";

export interface IGetUserAppointmentsUseCase {
    execute(userId: string, searchDTO: BookingSearchDTO): Promise<{ appointments: ResponseGetAppointments[], total: number }>;
}
