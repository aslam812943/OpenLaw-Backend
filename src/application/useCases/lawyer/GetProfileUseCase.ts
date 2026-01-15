import { IGetProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _lawyerRepository: ILawyerRepository) { }

  async execute(lawyerId: string): Promise<any> {

    try {
      const data = await this._lawyerRepository.findById(lawyerId);
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
