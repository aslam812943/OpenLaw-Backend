
import { Request, Response } from 'express';
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase';
import { AdminLoginRequestDTO } from '../../../application/dtos/admin/AdminLoginRequestDTO';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';


// ✅ AdminAuthController

export class AdminAuthController {
  constructor(private readonly _loginUseCase: LoginAdminUseCase) { }

  // ------------------------------------------------------------
  // Admin Login Handler
  // ------------------------------------------------------------


  async login(req: Request, res: Response) {

    console.log('admin login working ')
    try {

      const dto = new AdminLoginRequestDTO(req.body);


      const result = await this._loginUseCase.execute(dto);

      res.cookie("adminAccessToken", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('adminRefreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 1 * 24 * 60 * 60 * 1000
      })


      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Admin logged in successfully.",
        data: result,
      });

    } catch (error: any) {



      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "Login failed. Please check your credentials and try again.",
      });
    }
  }


  async logout(req: Request, res: Response): Promise<void> {
    req

    try {

      res.clearCookie("adminAccessToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      });

      res.clearCookie('adminRefreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      })


      //  Send success response
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Admin logged out successfully.",
      });
    } catch (error: any) {


      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to log out admin. Please try again later.",
      });
    }
  }

}
