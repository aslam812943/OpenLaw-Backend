import { IGetAllLawyersUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UserLawyerMapper } from "../../mapper/user/UserLawyerMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

import { ResponseGetLawyersDTO } from "../../dtos/user/ResponseGetLawyersDTO";

export class GetAllLawyersUseCase implements IGetAllLawyersUseCase {
  constructor(private _lawyerRepository: ILawyerRepository) { }

  async execute(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    filter?: string;
    fromAdmin?: boolean;
  }): Promise<{ success: boolean; total: number; lawyers: ResponseGetLawyersDTO[] }> {
    try {

      const { lawyers, total } = await this._lawyerRepository.findAll(query);

      if (!lawyers || lawyers.length === 0) {
        throw new NotFoundError("No lawyers found.");
      }

      const lawyerDTOs = UserLawyerMapper.toGetLawyerListDTO(lawyers);

      return {
        success: true,
        total,
        lawyers: lawyerDTOs,
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      }
      throw new BadRequestError("Failed to fetch lawyers. Please try again later.");
    }
  }
}
