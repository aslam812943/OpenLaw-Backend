

import { UpdateLawyerProfileDTO } from "../../../dtos/lawyer/UpdateLawyerProfileDTO"

export interface IGetProfileUseCase {
    execute(id:string):Promise<any>
}


export interface IUpdateProfileUseCase{
    execute(id:string,dto:UpdateLawyerProfileDTO):Promise<void>
}