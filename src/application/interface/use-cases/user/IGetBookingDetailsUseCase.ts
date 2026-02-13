import { ResponseGetAppointmentsDTO } from "../../../dtos/user/ResponseGetAppointments";

export interface IGetBookingDetailsUseCase {
    execute(bookingId: string): Promise<ResponseGetAppointmentsDTO>;
}
