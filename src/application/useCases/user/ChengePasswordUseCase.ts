import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IChangePasswordUseCase } from "../../interface/use-cases/user/IGetProfileUseCase";
import { ChangePasswordDTO } from "../../dtos/user/ChangePasswordDTO";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";






export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(dto: ChangePasswordDTO): Promise<void> {


    const user = await this._userRepository.findById(dto.id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }


    await this._userRepository.changePassword(
      dto.id,
      dto.oldPassword,
      dto.newPassword
    );

  }
}
