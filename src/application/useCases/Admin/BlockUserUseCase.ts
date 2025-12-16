import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { IBlockUserUseCase } from "../../interface/use-cases/admin/IBlockUserUseCase";


export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private _userRepo: IUserRepository) { }

  async execute(id: string): Promise<void> {

    // Block the user in the repository
    await this._userRepo.blockUser(id)
  }

}