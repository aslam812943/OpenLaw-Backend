import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IChangePasswordUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ChangePasswordDTO } from "../../dtos/lawyer/ChangePasswordDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private readonly _lawyer_repo: ILawyerRepository) { }

    async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {

        try {


            if (!dto.id) {
                throw new BadRequestError("Lawyer ID is required.");
            }

            if (!dto.oldPassword || !dto.newPassword) {
                throw new BadRequestError("Old and new password are required.");
            }


            const result = await this._lawyer_repo.changePassword(
                dto.id,
                dto.oldPassword,
                dto.newPassword
            );



            return { message: "Password changed successfully." };

        } catch (err: any) {


            if (err instanceof AppError) throw err;


            throw new BadRequestError(
                err.message || "Password change failed."
            );
        }
    }
}
