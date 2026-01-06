
import { Request, Response, NextFunction } from "express";
import { IRegisterUserUseCase } from "../../../application/interface/use-cases/user/IRegisterUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { VerifyOtpUseCase } from "../../../application/useCases/user/auth/VerifyOtpUseCase";
import { LoginUserDTO } from "../../../application/dtos/user/LoginUserDTO";
import { LoginUserUsecase } from "../../../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/ResendOtpUseCase";
import { ForgetPasswordRequestDTO } from "../../../application/dtos/user/ForgetPasswordRequestDTO";
import { RequestForgetPasswordUseCase } from "../../../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { VerifyResetPasswordUseCase } from "../../../application/useCases/user/auth/VerifyResetPasswordUseCase";
import { UserRegisterDTO } from "../../../application/dtos/user/RegisterUserDTO";
import { GoogleAuthUsecase } from "../../../application/useCases/user/GoogleAuthUseCase";




export class AuthController {
  constructor(
    private _registerUserCase: IRegisterUserUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private _loginUserUsecase: LoginUserUsecase,
    private _resendOtpUseCase: ResendOtpUseCase,
    private _requestForgetPasswordUseCase: RequestForgetPasswordUseCase,
    private _verifyResetPasswordUseCase: VerifyResetPasswordUseCase,
    private _googleAuthUseCase: GoogleAuthUsecase
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
      next(error)
    }
  }

  // ------------------------------------------------------------
  // Verify OTP for user registration
  // ------------------------------------------------------------

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      const result = await this.verifyOtpUseCase.execute(email, otp);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "OTP verified successfully!",
        user: result,
      });
    } catch (err: any) {
      next(err)
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
    } catch (err: any) {
      next(err)
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
    } catch (err: any) {
      next(err)
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
    } catch (err: any) {
      next(err)
    }
  }

  // ------------------------------------------------------------
  //  Login user and issue authentication tokens (access + refresh)
  // ------------------------------------------------------------
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const dto = new LoginUserDTO(req.body);
      const { token, refreshToken, user } = await this._loginUserUsecase.execute(dto);

      if (user.role == 'user') {
        res.cookie("userAccessToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });


        res.cookie("userRefreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      } else {
        res.cookie("lawyerAccessToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });


        res.cookie("lawyerRefreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }


      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Login successful.",
        token,
        refreshToken,
        user,
      });
    } catch (err: any) {
     
      next(err)
    }
  }


  // ------------------------------------------------------------
  // Logout user and clear authentication cookies
  // ------------------------------------------------------------

  async logoutUser(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      res.clearCookie("userAccessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: '/'
      });

      res.clearCookie("userRefreshToken", {
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


      next(error)
    }
  }
  // ------------------------------------------------------------
  //  Google Authentication
  // ------------------------------------------------------------
  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, role } = req.body;

      const result = await this._googleAuthUseCase.execute(token, role);

      if (result.needsRoleSelection) {
        res.status(HttpStatusCode.OK).json({
          success: true,
          message: "Please select a role.",
          needsRoleSelection: true,
        });
        return;
      }

      // Set Cookies
      if (result.user.role === 'user') {
        res.cookie("userAccessToken", result.token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("userRefreshToken", result.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      } else {
        res.cookie("lawyerAccessToken", result.token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("lawyerRefreshToken", result.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Google login successful.",
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
        needsVerificationSubmission: result.needsVerificationSubmission
      });

    } catch (error: any) {
      next(error)
    }
  }
}
