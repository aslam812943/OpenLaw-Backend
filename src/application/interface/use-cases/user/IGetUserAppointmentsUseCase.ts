import { ResponseGetAppoiments } from "../../../dtos/user/ResponseGetAppoiments";

export interface IGetUserAppointmentsUseCase {
    execute(userId: string, page?: number, limit?: number): Promise<{ appointments: ResponseGetAppoiments[], total: number }>;
}
