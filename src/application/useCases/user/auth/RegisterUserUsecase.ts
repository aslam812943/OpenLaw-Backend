import { UserRegisterDTO } from "../../../dtos/user/RegisterUserDTO";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import { IRegisterUserUseCase } from "../../../interface/use-cases/user/IRegisterUserUseCase";
import { IGenerateOtpUseCase } from "../../../interface/use-cases/user/IGenerateOtpUseCase";
import { IEmailService } from "../../../interface/services/IEmailService";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";


//  RegisterUserUsecase

export class RegisterUserUsecase implements IRegisterUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _lawyerRepo: ILawyerRepository,
    private _generateOtpUseCase: IGenerateOtpUseCase,
    private _mailService: IEmailService
  ) { }

  async execute(data: UserRegisterDTO): Promise<{ message: string }> {
    try {

      if (!data.email || !data.name || !data.password) {
        throw new BadRequestError("All fields (name, email, password) are required.");
      }


      const userExists = await this._userRepo.findByEmail(data.email);
      const lawyerExists = await this._lawyerRepo.findByEmail(data.email);

      if (userExists) {
        throw new BadRequestError("Email already exists as a regular user.");
      }

      if (lawyerExists) {
        throw new BadRequestError("Email already exists as a lawyer.");
      }


      const otp = await this._generateOtpUseCase.execute(data.email, data);
      if (!otp) {
        throw new BadRequestError("Failed to generate OTP. Please try again.");
      }


      await this._mailService.sendMail(
        data.email,
        "Welcome to LegalConnect - Your OTP Verification Code",
        `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 25px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0f766e;">Welcome to LegalConnect!</h2>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Thank you for registering with <span style="color: #059669; font-weight: 600;">LegalConnect</span>.</p>
          <p>To verify your email and complete your registration, please use the One-Time Password (OTP) provided below:</p>

          <div style="margin: 20px 0; text-align: center;">
            <div style="display: inline-block; padding: 15px 25px; background: linear-gradient(to right, #10b981, #14b8a6); color: white; border-radius: 8px; font-size: 22px; font-weight: bold; letter-spacing: 3px;">
              ${otp}
            </div>
          </div>

          <p style="font-size: 14px; color: #555;">⚠️ This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.</p>

          <p>If you did not request this registration, please ignore this email.</p>

          <br />
          <p>Best regards,</p>
          <p style="font-weight: 600; color: #0f766e;">The LegalConnect Team</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
        </div>
        `
      );

      return { message: "OTP sent successfully to the registered email." };
    } catch (error: any) {
      throw new BadRequestError(
        error.message || "Registration process failed. Please try again later."
      );
    }
  }
}
