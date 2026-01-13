import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IRegisterUserUseCase } from "../../../application/interface/use-cases/user/IRegisterUserUseCase";
import { IVerifyOtpUseCase } from "../../../application/interface/use-cases/user/IVerifyOtpUseCase";
import { ILoginUserUseCase } from "../../../application/interface/use-cases/user/ILoginUserUseCase";
import { IResendOtpUseCase } from "../../../application/interface/use-cases/user/IResendOtpUseCase";
import { IRequestForgetPasswordUseCase } from "../../../application/interface/use-cases/user/IRequestForgetPasswordUseCase";
import { IVerifyResetPasswordUseCase } from "../../../application/interface/use-cases/user/IVerifyResetPasswordUseCase";
import { IGoogleAuthUseCase } from "../../../application/interface/use-cases/user/IGoogleAuthUseCase";
import { UserRegisterDTO } from "../../../application/dtos/user/RegisterUserDTO";
import { LoginUserDTO } from "../../../application/dtos/user/LoginUserDTO";
import { ForgetPasswordRequestDTO } from "../../../application/dtos/user/ForgetPasswordRequestDTO";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class AuthController {
  constructor(
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _requestForgetPasswordUseCase: IRequestForgetPasswordUseCase,
    private readonly _verifyResetPasswordUseCase: IVerifyResetPasswordUseCase,
    private readonly _googleAuthUseCase: IGoogleAuthUseCase
  ) { }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UserRegisterDTO(req.body);
      const result = await this._registerUserUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: result.message || "User registered successfully! OTP sent to email.",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this._verifyOtpUseCase.execute(email, otp);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "OTP verified successfully!",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const message = await this._resendOtpUseCase.execute(email);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "OTP resent successfully!",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async requestForgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new ForgetPasswordRequestDTO(req.body);
      const message = await this._requestForgetPasswordUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "Password reset OTP sent successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await this._verifyResetPasswordUseCase.execute(req.body);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "Password reset successful!",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new LoginUserDTO(req.body);
      const { token, refreshToken, user } = await this._loginUserUseCase.execute(dto);

      const cookieSecure = process.env.COOKIE_SECURE === 'true';
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/',
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.ADMIN.LOGIN_SUCCESS,
        data: {
          token,
          refreshToken,
          user,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async logoutUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookieSecure = process.env.COOKIE_SECURE === 'true';
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/'
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/'
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.LOGOUT_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token: idToken, role } = req.body;
      const result = await this._googleAuthUseCase.execute(idToken, role);

      if (result.needsRoleSelection) {
        res.status(HttpStatusCode.OK).json({
          success: true,
          message: "Please select a role.",
          data: {
            needsRoleSelection: true
          }
        });
        return;
      }

      const cookieSecure = process.env.COOKIE_SECURE === 'true';
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      // Set Cookies
      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/',
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Google login successful.",
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
          user: result.user,
          needsVerificationSubmission: result.needsVerificationSubmission
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
}
