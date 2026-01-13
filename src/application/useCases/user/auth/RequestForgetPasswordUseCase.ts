import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IOtpService } from "../../../interface/services/IOtpService";
import { IEmailService } from "../../../interface/services/IEmailService";
import { ForgetPasswordRequestDTO } from "../../../dtos/user/ForgetPasswordRequestDTO";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { IRequestForgetPasswordUseCase } from "../../../interface/use-cases/user/IRequestForgetPasswordUseCase";
//  RequestForgetPasswordUseCase
export class RequestForgetPasswordUseCase implements IRequestForgetPasswordUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpService: IOtpService,
    private _mailService: IEmailService,
    private _lawyerRepo: ILawyerRepository
  ) { }

  async execute(data: ForgetPasswordRequestDTO): Promise<string> {
    try {
      if (!data.email) {
        throw new BadRequestError("Email is required to request a password reset.");
      }
      let user;
      user = await this._userRepo.findByEmail(data.email);
      if (!user) {
        user = await this._lawyerRepo.findByEmail(data.email)
      }

      if (!user) {
        throw new NotFoundError("No user found with this email address.");
      }

      const otp = await this._otpService.generateOtp(data.email, {
        email: data.email,
        userId: user.id,
      });

      if (!otp) {
        throw new BadRequestError("Failed to generate password reset OTP. Please try again.");
      }


      await this._mailService.sendMail(
        data.email,
        "Password Reset OTP - LegalConnect",
        `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f9fc; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #10b981; color: #ffffff; text-align: center; padding: 20px 0;">
              <h1 style="margin: 0; font-size: 24px;">LegalConnect</h1>
            </div>

            <div style="padding: 30px;">
              <h2 style="color: #333333; margin-bottom: 10px;">Hello ${user.name || "User"},</h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.6;">
                We received a request to reset your password for your <strong>LegalConnect</strong> account.
                Please use the OTP below to proceed with resetting your password.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 15px 25px; background-color: #10b981; color: #ffffff; font-size: 22px; letter-spacing: 3px; border-radius: 8px; font-weight: bold;">
                  ${otp}
                </div>
              </div>

              <p style="color: #555555; font-size: 14px; line-height: 1.6;">
                This OTP is valid for <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.
              </p>

              <p style="margin-top: 20px; color: #666666; font-size: 14px;">
                Thanks,<br />
                <strong>The LegalConnect Team</strong>
              </p>
            </div>

            <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #888888;">
              © ${new Date().getFullYear()} LegalConnect. All rights reserved.<br />
              <em>This is an automated email. Please do not reply.</em>
            </div>
          </div>
        </div>
        `
      );

      return "Password reset OTP sent successfully.";
    } catch (error: any) {
      throw new BadRequestError(
        error.message ||
        "An unexpected error occurred while requesting password reset."
      );
    }
  }
}
