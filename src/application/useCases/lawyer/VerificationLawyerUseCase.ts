import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { VerificationLawyerDTO } from "../../dtos/lawyer/VerificationLawyerDTO";

export class RegisterLawyerUseCase {
  constructor(private lawyerRepo: ILawyerRepository) { }

  async execute(data: VerificationLawyerDTO): Promise<Lawyer> {
    
    return await this.lawyerRepo.addVerificationDetils(data);
  }
}

