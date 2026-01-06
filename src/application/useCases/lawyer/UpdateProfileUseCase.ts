import { IUpdateProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateLawyerProfileDTO } from "../../dtos/lawyer/UpdateLawyerProfileDTO";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";




export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private readonly _repo: ILawyerRepository) { }
    async execute(id: string, dto: UpdateLawyerProfileDTO): Promise<void> {
        if (!id) throw new BadRequestError("Invalid request: User ID is missing");
        if (!dto) throw new BadRequestError('data missing ')
      
        await this._repo.updateProfile(id, dto)
    }
}