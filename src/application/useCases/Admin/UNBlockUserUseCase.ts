import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IUNBlockUserUseCase } from "../../interface/use-cases/admin/IUNBlockUserUseCase";



export class UNBlockuserUseCase implements IUNBlockUserUseCase {
    constructor(private _userRepository: IUserRepository) { }
    async execute(userId: string): Promise<void> {

        await this._userRepository.unBlockUser(userId)
    }

}