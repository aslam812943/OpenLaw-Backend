import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IChangePasswordUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ChangePasswordDTO } from "../../dtos/lawyer/ChangePasswordDTO";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";


export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private readonly _lawyerRepository: ILawyerRepository) { }

    async execute(dto: ChangePasswordDTO): Promise<void> {
        if (!dto.id) {
            throw new BadRequestError("Lawyer ID is required.");
        }
        if (!dto.oldPassword || !dto.newPassword) {
            throw new BadRequestError("Old and new password are required.");
        }

        await this._lawyerRepository.changePassword(
            dto.id,
            dto.oldPassword,
            dto.newPassword
        );

    }
}
