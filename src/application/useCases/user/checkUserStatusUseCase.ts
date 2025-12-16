import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class CheckUserStatusUseCase {
  constructor(private _repo: IUserRepository) { }

  async check(id: string): Promise<{ isActive: boolean }> {

    if (!id) {
      throw new BadRequestError("User ID is required.");
    }

   
    const user = await this._repo.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return { isActive: !user.isBlock };
  }
}
