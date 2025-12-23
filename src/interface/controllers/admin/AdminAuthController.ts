
import { Request, Response } from 'express';
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase';
import AdminLoginRequestDTO from '../../../application/dtos/admin/AdminLoginRequestDTO';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';


//  AdminAuthController

export class AdminAuthController {
  constructor(private readonly _loginUseCase: LoginAdminUseCase) { }

  // ------------------------------------------------------------
  // Admin Login Handler
  // ------------------------------------------------------------


  async login(req: Request, res: Response, next: any) {
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
      next(error);
    }
  }


  async logout(_req: Request, res: Response, next: any): Promise<void> {
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

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Admin logged out successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }

}
