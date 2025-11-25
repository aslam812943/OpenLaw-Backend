import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IChangePasswordUseCase } from "../../useCases/interface/lawyer/IProfileUseCases";
import { ChangePasswordDTO } from "../../dtos/lawyer/ChangePasswordDTO";


export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private readonly _lawyer_repo: ILawyerRepository) { }

    async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {
        

        try {

            // if (!dto.id) {
            //     throw new Error("Lawyer ID is missing.");
            // }
            // if (!dto.oldPassword || !dto.newPassword) {
            //     throw new Error("Both old and new passwords are required.");
            // }
            // if (dto.newPassword.length < 6) {
            //     throw new Error("New password must be at least 6 characters long.");
            // }


            const result = await this._lawyer_repo.changePassword(
                dto.id,
                dto.oldPassword,
                dto.newPassword
            );


            return { message: "Password changed successfully." };

        } catch (err: any) {

        

            throw new Error(err.message || "Password change failed.");
        }
    }
}
