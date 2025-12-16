import { IGetProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: ILawyerRepository) { }

  async execute(id: string): Promise<any> {

    try {


      const data = await this._repo.findById(id);

      if (!data) {
        throw new NotFoundError(`Profile not found for user ID: ${id}`);
      }


      return GetProfileMapper.toDTO(data);

    } catch (err: any) {

      if (err instanceof AppError) throw err;


      throw new BadRequestError(
        err.message || "Failed to fetch profile data."
      );
    }
  }
}
