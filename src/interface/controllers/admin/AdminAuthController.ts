import {Request,Response} from 'express'
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase'
// import { AdminRepository } from '../../../infrastructure/repositories/admin/AdminRepository'
// import { JwtService } from '../../../infrastructure/services/jwt/JwtService'
import {AdminLoginRequestDTO} from '../../../application/dtos/admin/AdminLoginRequestDTO'


// const adminRepository = new AdminRepository();
// const jwtSerivice = new JwtService()
// const loginUseCase = new LoginAdminUseCase(adminRepository)
// loginUseCase.createInitialAdmin();


export class AdminAuthController{
constructor(private readonly _loginUseCase:LoginAdminUseCase){}

    async login (req:Request,res:Response){
        console.log('admin login')
 try {
      const dto = new AdminLoginRequestDTO(req.body);
      const result = await this._loginUseCase.execute(dto);

      res.cookie("authToken", result.token, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
    }
}