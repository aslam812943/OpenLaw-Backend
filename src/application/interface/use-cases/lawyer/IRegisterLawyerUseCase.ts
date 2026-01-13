import { Lawyer } from "../../../../domain/entities/Lawyer";
import { VerificationLawyerDTO } from "../../../dtos/lawyer/VerificationLawyerDTO";

export interface IRegisterLawyerUseCase {
    execute(data: VerificationLawyerDTO): Promise<Lawyer>;
}
