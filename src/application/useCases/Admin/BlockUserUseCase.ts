import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IBlockUserUseCase } from "../../interface/use-cases/admin/IBlockUserUseCase";


export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<void> {

    await this._userRepository.blockUser(userId)
  }

}