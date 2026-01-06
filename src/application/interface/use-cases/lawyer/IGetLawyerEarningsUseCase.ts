import { GetLawyerEarningsDTO } from "../../../dtos/lawyer/GetLawyerEarningsDTO";

export interface IGetLawyerEarningsUseCase {
    execute(lawyerId: string): Promise<GetLawyerEarningsDTO>;
}
