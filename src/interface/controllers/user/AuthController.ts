
import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../application/interface/user/IRegisterUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { VerifyOtpUseCase } from "../../../application/useCases/user/auth/VerifyOtpUseCase";
import { LoginUserDTO } from "../../../application/dtos/user/LoginUserDTO";
import { LoginUserUsecase } from "../../../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/ResendOtpUseCase";
import { ForgetPasswordRequestDTO } from "../../../application/dtos/user/ForgetPasswordRequestDTO";
import { RequestForgetPasswordUseCase } from "../../../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { VerifyResetPasswordUseCase } from "../../../application/useCases/user/auth/VerifyResetPasswordUseCase";
import { UserRegisterDTO } from "../../../application/dtos/user/ RegisterUserDTO";



export class AuthController {
  constructor(
    private _registerUserCase: IRegisterUserUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private _loginUserUsecase: LoginUserUsecase,
    private _resendOtpUseCase: ResendOtpUseCase,
    private _requestForgetPasswordUseCase: RequestForgetPasswordUseCase,
    private _verifyResetPasswordUseCase: VerifyResetPasswordUseCase
  ) { }

  // ------------------------------------------------------------
  //  Register a new user and send OTP to their email
  // -----------------------------------------------------------

  async registerUser(req: Request, res: Response): Promise<void> {
    try {

      const dto = new UserRegisterDTO(req.body);
      const result = await this._registerUserCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: result.message || "User registered successfully! OTP sent to email.",
      });
    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error.message || "User registration failed. Please try again.",
      });
    }
  }

  // ------------------------------------------------------------
  // Verify OTP for user registration
  // ------------------------------------------------------------

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this.verifyOtpUseCase.execute(email, otp);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "OTP verified successfully!",
        user: result,
      });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Invalid OTP. Please try again.",
      });
    }
  }

  // ------------------------------------------------------------
  //  Resend OTP to user email
  // ------------------------------------------------------------

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const message = await this._resendOtpUseCase.execute(email);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "OTP resent successfully!",
      });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Failed to resend OTP. Please try again.",
      });
    }
  }

  // ------------------------------------------------------------
  //  Request to reset password (sends OTP to user email)
  // ------------------------------------------------------------

  async requestForgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const dto = new ForgetPasswordRequestDTO(req.body);
      const message = await this._requestForgetPasswordUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "Password reset OTP sent successfully.",
      });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Failed to send reset OTP. Please try again.",
      });
    }
  }

  // ------------------------------------------------------------
  //  Verify reset password OTP and update new password
  // ------------------------------------------------------------

  async verifyResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const message = await this._verifyResetPasswordUseCase.execute(req.body);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: message || "Password reset successful!",
      });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Password reset failed. Invalid or expired OTP.",
      });
    }
  }

  // ------------------------------------------------------------
  //  Login user and issue authentication tokens (access + refresh)
  // ------------------------------------------------------------
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const dto = new LoginUserDTO(req.body);
      const { token, refreshToken, user } = await this._loginUserUsecase.execute(dto);

      if (user.role == 'user') {
        res.cookie("userAccessToken", token, {
          httpOnly: true,
          secure: false,
          maxAge: 15 * 60 * 1000, // 15 minutes
        });


        res.cookie("userRefreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      } else {
        res.cookie("lawyerAccessToken", token, {
          httpOnly: true,
          secure: false,
          maxAge: 15 * 60 * 1000, // 15 minutes
        });


        res.cookie("lawyerRefreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
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
    
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: err.message || "Invalid credentials. Please check your email or password.",
      });
    }
  }


  // ------------------------------------------------------------
  // Logout user and clear authentication cookies
  // ------------------------------------------------------------

  async logoutUser(_req: Request, res: Response): Promise<void> {
    try {
      
      res.clearCookie("userAccessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",

      });

      res.clearCookie("userRefreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",

      });


      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "User logged out successfully.",
      });
    } catch (error: any) {
    

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to log out. Please try again later.",
      });
    }
  }
}
