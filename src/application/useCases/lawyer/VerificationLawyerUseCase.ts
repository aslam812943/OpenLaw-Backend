import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { VerificationLawyerDTO } from "../../dtos/lawyer/VerificationLawyerDTO";

export class RegisterLawyerUseCase {
  constructor(private lawyerRepo: ILawyerRepository) { }

  async execute(data: VerificationLawyerDTO): Promise<Lawyer> {
    // Add verification details to the lawyer profile
    return await this.lawyerRepo.addVerificationDetils(data);
  }
}

