import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { IUNBlockUserUseCase } from "../../interface/use-cases/admin/IUNBlockUserUseCase";



export class UNBlockuserUseCase implements IUNBlockUserUseCase {
    constructor(private _userRepo: IUserRepository) { }
    async execute(id: string): Promise<void> {
        // Unblock the user in the repository
        await this._userRepo.unBlockUser(id)
    }

}