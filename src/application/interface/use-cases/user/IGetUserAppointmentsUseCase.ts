import { ResponseGetAppointments } from "../../../dtos/user/ResponseGetAppointments";

export interface IGetUserAppointmentsUseCase {
    execute(userId: string, page?: number, limit?: number): Promise<{ appointments: ResponseGetAppointments[], total: number }>;
}
