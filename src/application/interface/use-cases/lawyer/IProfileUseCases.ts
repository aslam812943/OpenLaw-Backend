

import { UpdateLawyerProfileDTO } from "../../../dtos/lawyer/UpdateLawyerProfileDTO"
import { ChangePasswordDTO } from "../../../dtos/lawyer/ChangePasswordDTO"

import { ResponseGetProfileDTO } from "../../../dtos/lawyer/ResponseGetProfileDTO"

export interface IGetProfileUseCase {
    execute(id: string): Promise<ResponseGetProfileDTO>
}


export interface IUpdateProfileUseCase {
    execute(id: string, dto: UpdateLawyerProfileDTO): Promise<void>
}

export interface IChangePasswordUseCase {
    execute(data: ChangePasswordDTO): Promise<void>
}