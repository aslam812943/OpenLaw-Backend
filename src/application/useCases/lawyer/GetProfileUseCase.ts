import { IGetProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: ILawyerRepository) { }

  async execute(lawyerId: string): Promise<any> {

    try {


      const data = await this._repo.findById(lawyerId);
      

      if (!data) {
        throw new NotFoundError(`Profile not found for user ID: ${lawyerId}`);
      }

      return GetProfileMapper.toDTO(data);

    } catch (err: any) {


      throw new BadRequestError(
        err.message || "Failed to fetch profile data."
      );
    }
  }
}
