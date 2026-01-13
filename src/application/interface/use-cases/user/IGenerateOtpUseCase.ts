import { UserRegisterDTO } from "../../../dtos/user/RegisterUserDTO";

export interface IGenerateOtpUseCase {
    execute(email: string, data: UserRegisterDTO): Promise<string>;
}
