import { IGetSingleLawyerUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { LawyerMapper } from "../../mapper/lawyer/LawyerMapper";
import { ResponseGetSingleLawyerDTO } from "../../dtos/user/ResponseGetSingleLawyerDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetSingleLawyerUseCase implements IGetSingleLawyerUseCase {

  constructor(private _repo: ILawyerRepository) { }

  async execute(id: string): Promise<ResponseGetSingleLawyerDTO> {

    if (!id) {
      throw new BadRequestError("Lawyer ID is required.");
    }

   
    const lawyer = await this._repo.findById(id);

    if (!lawyer) {
      throw new NotFoundError("Lawyer not found.");
    }

    return LawyerMapper.toSingle(lawyer);
  }
}
