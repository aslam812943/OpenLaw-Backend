import { ResetPasswordDTO } from "../../../dtos/user/ResetPasswordDTO";

export interface IVerifyResetPasswordUseCase {
    execute(data: ResetPasswordDTO): Promise<string>;
}
