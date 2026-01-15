import { IUpdateProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateLawyerProfileDTO } from "../../dtos/lawyer/UpdateLawyerProfileDTO";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";




export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private _lawyerRepository: ILawyerRepository) { }
    async execute(lawyerId: string, profileData: UpdateLawyerProfileDTO): Promise<void> {
        if (!lawyerId) throw new BadRequestError("Invalid request: lawyer ID is missing");
        if (!profileData) throw new BadRequestError('data missing ')
      
        await this._lawyerRepository.updateProfile(lawyerId, profileData)
    }
}