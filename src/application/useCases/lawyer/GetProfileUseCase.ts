import { IGetProfileUseCase } from "../interface/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetProfileMapper } from "../../mapper/lawyer/GetProfileMapper";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: ILawyerRepository) {}

  async execute(id: string): Promise<any> {
    if (!id) {
      throw new Error("Invalid request: User ID is missing");
    }

    const data = await this._repo.findById(id);

  
    if (!data) {
      throw new Error(`Profile not found for user ID: ${id}`);
    }

    return GetProfileMapper.toDTO(data);
  }
}
