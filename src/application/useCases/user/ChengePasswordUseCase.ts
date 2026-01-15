import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IChangePasswordUseCase } from "../../interface/use-cases/user/IGetProfileUseCase";
import { ChangePasswordDTO } from "../../dtos/user/ChangePasswordDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";






export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(dto: ChangePasswordDTO): Promise<{ message: string }> {


    const user = await this._userRepository.findById(dto.id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }


    try {
      const result = await this._userRepository.changePassword(
        dto.id,
        dto.oldPassword,
        dto.newPassword
      );

      return { message: "Password changed successfully." };

    } catch (err: any) {
      throw new BadRequestError(
        "Something went wrong while changing the password. Please try again."
      );
    }
  }
}
