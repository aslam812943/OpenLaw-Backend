import LoginDTO from '../../../dtos/admin/AdminLoginRequestDTO'

export interface IAdminUseCase{
    loginAdmin(data:LoginDTO):Promise<{token:string,name:string,email:string}>
}