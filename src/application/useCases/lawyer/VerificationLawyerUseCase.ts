import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { VerificationLawyerDTO } from "../../dtos/lawyer/VerificationLawyerDTO";
import { IRegisterLawyerUseCase } from "../../interface/use-cases/lawyer/IRegisterLawyerUseCase";

export class RegisterLawyerUseCase implements IRegisterLawyerUseCase {
  constructor(private _lawyerRepository: ILawyerRepository) { }

  async execute(data: VerificationLawyerDTO): Promise<Lawyer> {

    return await this._lawyerRepository.addVerificationDetils(data);
  }
}

