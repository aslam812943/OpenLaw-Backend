import {Request,Response} from 'express'
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase'
import { AdminRepository } from '../../../infrastructure/repositories/admin/AdminRepository'
// import { JwtService } from '../../../infrastructure/services/jwt/JwtService'
import LoginDTO from '../../../application/dtos/admin/LoginDTO'
import { error } from 'console'

const adminRepository = new AdminRepository();
// const jwtSerivice = new JwtService()
const loginUseCase = new LoginAdminUseCase(adminRepository)
// loginUseCase.createInitialAdmin();


export class AdminAuthController{
    async login (req:Request,res:Response){
        console.log('admin login')
        try{
            const AdminLoginDTO = new LoginDTO(req.body)
            console.log('after dto',AdminLoginDTO)
            const result = await loginUseCase.loginAdmin(AdminLoginDTO)
            const {token} = result
            res.cookie('authToken',token,{
                httpOnly:true,
                secure:false,
                maxAge: 15*60*10000
            })
            return res.status(200).json({
                message:'Login successful',
                data:result
            })
        }catch(error:any){
            return res.status(400).json({message:error.message})
        }
    }
}