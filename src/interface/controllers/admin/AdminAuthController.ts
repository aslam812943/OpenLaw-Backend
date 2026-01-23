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

      const cookieSecure = process.env.COOKIE_SECURE === 'true';
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN || '.http://localhost:8080',
        path: '/',
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000
      });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.ADMIN.LOGIN_SUCCESS,
        data: result,
      });

    } catch (error: unknown) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookieSecure = process.env.COOKIE_SECURE === 'true';
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/'
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/'
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.ADMIN.LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
