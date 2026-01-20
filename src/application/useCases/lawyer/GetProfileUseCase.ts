import { IGetProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

import { ResponseGetProfileDTO } from "../../dtos/lawyer/ResponseGetProfileDTO";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _lawyerRepository: ILawyerRepository) { }

  async execute(lawyerId: string): Promise<ResponseGetProfileDTO> {

    try {
      const data = await this._lawyerRepository.findById(lawyerId);
      if (!data) {
        throw new NotFoundError(`Profile not found for user ID: ${lawyerId}`);
      }

      return GetProfileMapper.toDTO(data);

    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestError(err.message);
      }
      throw new BadRequestError("Failed to fetch profile data.");
    }
  }
}
