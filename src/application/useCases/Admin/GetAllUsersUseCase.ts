import { IGetAllUsersUseCase } from "../interface/admin/IGetAllUsersUseCase";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { GetAllUserDTO } from "../../dtos/admin/GetAllUserDTO";
import { AdminUserMapper } from "../../mapper/admin/AdminUserMapper";


export class GetAllUsersUseCase implements IGetAllUsersUseCase<void,GetAllUserDTO[]>{
    constructor (private _userRepo:IUserRepository){}

    async execute(): Promise<GetAllUserDTO[]> {
        const user = await this._userRepo.findAll();
        return AdminUserMapper.toUserSummaryListDTO(user)
            
        
    }
}