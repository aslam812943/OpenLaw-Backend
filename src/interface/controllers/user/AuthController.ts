
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

export class AuthController {
  constructor(
    private _registerUserCase: IRegisterUserUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _loginUserUsecase: ILoginUserUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _requestForgetPasswordUseCase: IRequestForgetPasswordUseCase,
    private _verifyResetPasswordUseCase: IVerifyResetPasswordUseCase,
    private _googleAuthUseCase: IGoogleAuthUseCase
  ) { }

  // ------------------------------------------------------------
  //  Register a new user and send OTP to their email
  // -----------------------------------------------------------

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new UserRegisterDTO(req.body);
      const result = await this._registerUserCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: result.message || "User registered successfully! OTP sent to email.",
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------------------------------------------
  // Verify OTP for user registration
  // ------------------------------------------------------------

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this._verifyOtpUseCase.execute(email, otp);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "OTP verified successfully!",
        user: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------------------------------------------
  //  Resend OTP to user email
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  //  Request to reset password (sends OTP to user email)
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  //  Verify reset password OTP and update new password
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  //  Login user and issue authentication tokens (access + refresh)
  // ------------------------------------------------------------
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new LoginUserDTO(req.body);
      const { token, refreshToken, user } = await this._loginUserUsecase.execute(dto);

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000, 
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Login successful.",
        token,
        refreshToken,
        user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------------------------------------------
  // Logout user and clear authentication cookies
  // ------------------------------------------------------------

  async logoutUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: '/'
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: '/'
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "User logged out successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------------------------------------------
  //  Google Authentication
  // ------------------------------------------------------------
  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token: idToken, role } = req.body;
      const result = await this._googleAuthUseCase.execute(idToken, role);

      if (result.needsRoleSelection) {
        res.status(HttpStatusCode.OK).json({
          success: true,
          message: "Please select a role.",
          needsRoleSelection: true,
        });
        return;
      }

      // Set Cookies
      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Google login successful.",
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
        needsVerificationSubmission: result.needsVerificationSubmission
      });
    } catch (error: any) {
      next(error);
    }
  }
}
