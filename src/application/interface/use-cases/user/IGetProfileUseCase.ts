import { ResponseGetProfileDTO } from "../../../dtos/user/ResponseGetProfileDTO"
import { ChangePasswordDTO } from "../../../dtos/user/ChangePasswordDTO"
import { ProfileUpdateDTO } from "../../../dtos/user/ProfileupdateDTO"


export interface IGetProfileUseCase {
    execute(id: string): Promise<ResponseGetProfileDTO>
}



export interface IChangePasswordUseCase {
    execute(data: ChangePasswordDTO): Promise<void>
}



export interface IProfileEditUseCase {
    execute(data: ProfileUpdateDTO): Promise<void>
}