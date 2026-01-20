import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { ICheckUserStatusUseCase } from "../../interface/use-cases/user/ICheckUserStatusUseCase";

export class CheckUserStatusUseCase implements ICheckUserStatusUseCase {
  constructor(private _userRepository: IUserRepository) { }

  async check(userId: string): Promise<{ isActive: boolean }> {

    if (!userId) {
      throw new BadRequestError("User ID is required.");
    }


    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return { isActive: !user.isBlock };
  }
}
