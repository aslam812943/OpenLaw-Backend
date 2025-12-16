import { UserRegisterDTO } from "../../../dtos/user/RegisterUserDTO";

export interface IRegisterUserUseCase {
  execute(data: UserRegisterDTO): Promise<{ message: string }>;
}
