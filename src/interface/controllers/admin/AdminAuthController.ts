import { Request, Response, NextFunction } from 'express';
import { ILoginAdminUseCase } from '../../../application/interface/use-cases/admin/ILoginAdminUseCase';
import AdminLoginRequestDTO from '../../../application/dtos/admin/AdminLoginRequestDTO';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';
import { MessageConstants } from '../../../infrastructure/constants/MessageConstants';

export class AdminAuthController {
  constructor(private readonly _loginUseCase: ILoginAdminUseCase) { }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDto = new AdminLoginRequestDTO(req.body);
      const result = await this._loginUseCase.execute(loginDto);

      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.ADMIN.LOGIN_SUCCESS,
        data: result,
      });

    } catch (error: any) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.ADMIN.LOGOUT_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
