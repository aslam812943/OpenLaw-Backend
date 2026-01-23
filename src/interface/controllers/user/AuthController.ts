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
import { ITokenService } from "../../../application/interface/services/TokenServiceInterface";
import { UserRole } from "../../../infrastructure/interface/enums/UserRole";

export class AuthController {
  constructor(
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _requestForgetPasswordUseCase: IRequestForgetPasswordUseCase,
    private readonly _verifyResetPasswordUseCase: IVerifyResetPasswordUseCase,
    private readonly _googleAuthUseCase: IGoogleAuthUseCase,
    private readonly _tokenService: ITokenService
  ) { }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UserRegisterDTO(req.body);
      const result = await this._registerUserUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: result.message || "User registered successfully! OTP sent to email.",
      });
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new LoginUserDTO(req.body);
      const { token, refreshToken, user } = await this._loginUserUseCase.execute(dto);

      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: user.role === UserRole.LAWYER ? MessageConstants.LAWYER.LOGIN_SUCCESS : (user.role === UserRole.ADMIN ? MessageConstants.ADMIN.LOGIN_SUCCESS : MessageConstants.USER.LOGIN_SUCCESS),
        data: {
          token,
          refreshToken,
          user,
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/'
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/'
      });

      const accessToken = req.cookies?.accessToken;
      let logoutMessage: string = MessageConstants.COMMON.SUCCESS;

      if (accessToken) {
        try {
          const decoded = this._tokenService.verifyToken(accessToken);
          if (decoded.role === UserRole.LAWYER) {
            logoutMessage = MessageConstants.LAWYER.LOGOUT_SUCCESS;
          } else if (decoded.role === UserRole.USER) {
            logoutMessage = MessageConstants.USER.LOGOUT_SUCCESS;
          }
        } catch (error) {
        }
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: logoutMessage,
      });
    } catch (error: unknown) {
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

      const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';


      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE)
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: cookieSameSite,
        domain: process.env.COOKIE_DOMAIN,
        path: '/',
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE)
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
    } catch (error: unknown) {
      next(error);
    }
  }
}
