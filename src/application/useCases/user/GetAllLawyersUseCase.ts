import { IGetAllLawyersUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UserLawyerMapper } from "../../mapper/user/UserLawyerMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class GetAllLawyersUseCase implements IGetAllLawyersUseCase {
  constructor(private _lawyerRepository: ILawyerRepository) { }

  async execute(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    filter?: string;
    fromAdmin?: boolean;
  }): Promise<any> {
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

    } catch (error: any) {

      throw new BadRequestError(
        error.message || "Failed to fetch lawyers. Please try again later."
      );
    }
  }
}
