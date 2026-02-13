import { GetLawyerEarningsDTO } from "../../../dtos/lawyer/GetLawyerEarningsDTO";

export interface IGetLawyerEarningsUseCase {
    execute(lawyerId: string, page?: number, limit?: number): Promise<GetLawyerEarningsDTO>;
}
