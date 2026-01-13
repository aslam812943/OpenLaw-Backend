import { ForgetPasswordRequestDTO } from "../../../dtos/user/ForgetPasswordRequestDTO";

export interface IRequestForgetPasswordUseCase {
    execute(data: ForgetPasswordRequestDTO): Promise<string>;
}
