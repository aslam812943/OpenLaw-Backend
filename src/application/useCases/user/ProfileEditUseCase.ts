import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { ProfileUpdateDTO } from "../../dtos/user/ProfileupdateDTO";
import { IProfileEditUseCase } from "../../interface/use-cases/user/IGetProfileUseCase";



export class ProfileEditUseCase implements IProfileEditUseCase {
    constructor(private readonly _userRepo: IUserRepository) { }

    async execute(data: ProfileUpdateDTO): Promise<void> {
      
        await this._userRepo.profileUpdate(data.id, data.name, data.phone, data.profileImage, data.address, data.city, data.state, data.pincode)
    }
}