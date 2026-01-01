import { GetLawyerCasesDTO } from "../../../dtos/lawyer/GetLawyerCasesDTO";

export interface IGetLawyerCasesUseCase {
    execute(lawyerId: string): Promise<GetLawyerCasesDTO[]>;
}
