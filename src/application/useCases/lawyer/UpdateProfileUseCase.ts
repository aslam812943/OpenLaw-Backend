import { IUpdateProfileUseCase } from "../interface/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateLawyerProfileDTO } from "../../dtos/lawyer/UpdateLawyerProfileDTO";




export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private readonly _repo: ILawyerRepository) { }
    async execute(id: string, dto: UpdateLawyerProfileDTO): Promise<void> {
        if (!id) throw new Error("Invalid request: User ID is missing");
        if (!dto) throw new Error('data missing ')
        await this._repo.updateProfile(id, dto)
    }
}