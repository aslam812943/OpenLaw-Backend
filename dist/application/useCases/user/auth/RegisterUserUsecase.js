"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUsecase = void 0;
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
//  RegisterUserUsecase
class RegisterUserUsecase {
    constructor(_userRepo, _lawyerRepo, _generateOtpUseCase, _mailService) {
        this._userRepo = _userRepo;
        this._lawyerRepo = _lawyerRepo;
        this._generateOtpUseCase = _generateOtpUseCase;
        this._mailService = _mailService;
    }
    async execute(data) {
        try {
            if (!data.email || !data.name || !data.password) {
                throw new BadRequestError_1.BadRequestError("All fields (name, email, password) are required.");
            }
            const userExists = await this._userRepo.findByEmail(data.email);
            const lawyerExists = await this._lawyerRepo.findByEmail(data.email);
            if (userExists) {
                throw new BadRequestError_1.BadRequestError("Email already exists as a regular user.");
            }
            if (lawyerExists) {
                throw new BadRequestError_1.BadRequestError("Email already exists as a lawyer.");
            }
            const otp = await this._generateOtpUseCase.execute(data.email, data);
            if (!otp) {
                throw new BadRequestError_1.BadRequestError("Failed to generate OTP. Please try again.");
            }
            await this._mailService.sendMail(data.email, "Welcome to LegalConnect - Your OTP Verification Code", `
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
        `);
            return { message: "OTP sent successfully to the registered email." };
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(error.message || "Registration process failed. Please try again later.");
        }
    }
}
exports.RegisterUserUsecase = RegisterUserUsecase;
//# sourceMappingURL=RegisterUserUsecase.js.map