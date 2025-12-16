import { ResponseGetAppoiments } from "../../../dtos/user/ResponseGetAppoiments";

export interface IGetUserAppointmentsUseCase {
    execute(userId: string): Promise<ResponseGetAppoiments[]>;
}
