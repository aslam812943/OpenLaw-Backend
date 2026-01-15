import { LoginUserDTO } from "../../../dtos/user/LoginUserDTO";
import { LoginResponseDTO } from "../../../dtos/user/LoginResponseDTO";

export interface ILoginUserUseCase {
    execute(data: LoginUserDTO): Promise<{ token: string; refreshToken: string; user: LoginResponseDTO }>;
}
