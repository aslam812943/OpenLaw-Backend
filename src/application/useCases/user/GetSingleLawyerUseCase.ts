import { IGetSingleLawyerUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { LawyerMapper } from "../../mapper/lawyer/LawyerMapper";
import { ResponseGetSingleLawyerDTO } from "../../dtos/user/ResponseGetSingleLawyerDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetSingleLawyerUseCase implements IGetSingleLawyerUseCase {

  constructor(private _lawyerRepository: ILawyerRepository) { }

  async execute(lawyerId: string): Promise<ResponseGetSingleLawyerDTO> {

    if (!lawyerId) {
      throw new BadRequestError("Lawyer ID is required.");
    }


    const lawyer = await this._lawyerRepository.findById(lawyerId);

    if (!lawyer || lawyer.isBlock || !lawyer.isAdminVerified || !lawyer.paymentVerify || !lawyer.isVerified) {
      throw new NotFoundError("Lawyer not found or is currently inactive.");
    }

    return LawyerMapper.toSingle(lawyer);
  }
}
