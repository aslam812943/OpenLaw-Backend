

import { UpdateLawyerProfileDTO } from "../../../dtos/lawyer/UpdateLawyerProfileDTO"
import { ChangePasswordDTO } from "../../../dtos/lawyer/ChangePasswordDTO"

export interface IGetProfileUseCase {
    execute(id: string): Promise<any>
}


export interface IUpdateProfileUseCase {
    execute(id: string, dto: UpdateLawyerProfileDTO): Promise<void>
}

export interface IChangePasswordUseCase {
    execute(data: ChangePasswordDTO): Promise<any>
}