import LoginDTO from '../../dtos/admin/LoginDTO'

export interface IAdminUseCase{
    loginAdmin(data:LoginDTO):Promise<{token:string,name:string,email:string}>
}