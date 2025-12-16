"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpUseCase = void 0;
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../../infrastructure/errors/NotFoundError");
// ResendOtpUseCase
class ResendOtpUseCase {
    constructor(_redisCacheService, _otpService, _mailService) {
        this._redisCacheService = _redisCacheService;
        this._otpService = _otpService;
        this._mailService = _mailService;
    }
    async execute(email) {
        try {
            if (!email) {
                throw new BadRequestError_1.BadRequestError("Email is required to resend OTP.");
            }
            const redisData = await this._redisCacheService.get(`otp:${email}`);
            if (!redisData) {
                throw new NotFoundError_1.NotFoundError("No registration data found for this email. Please register again.");
            }
            const { data } = JSON.parse(redisData);
            if (!data) {
                throw new BadRequestError_1.BadRequestError("Corrupted registration data. Please register again.");
            }
            const userDto = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                isVerified: data.isVerified,
                role: data.role,
                isBlock: data.isBlock,
            };
            const otp = await this._otpService.generateOtp(email, userDto);
            if (!otp) {
                throw new BadRequestError_1.BadRequestError("Failed to generate a new OTP. Please try again later.");
            }
            await this._mailService.sendMail(email, "LegalConnect - Your New OTP Code (Resent)", `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 25px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0f766e;">LegalConnect - OTP Resent</h2>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>We noticed you requested a new OTP to verify your email address associated with your LegalConnect account.</p>
          <p>Please use the following One-Time Password (OTP) to continue your registration process:</p>

          <div style="margin: 20px 0; text-align: center;">
            <div style="display: inline-block; padding: 15px 25px; background: linear-gradient(to right, #10b981, #14b8a6); color: white; border-radius: 8px; font-size: 22px; font-weight: bold; letter-spacing: 3px;">
              ${otp}
            </div>
          </div>

          <p style="font-size: 14px; color: #555;">⚠️ This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for your security.</p>

          <p>If you did not request this code, please ignore this email. Your account security is our top priority.</p>

          <br/>
          <p>Best regards,</p>
          <p style="font-weight: 600; color: #0f766e;">The LegalConnect Team</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this message.</p>
        </div>
        `);
            return "OTP resent successfully.";
        }
        catch (err) {
            throw new BadRequestError_1.BadRequestError(err.message ||
                "An unexpected error occurred while resending the OTP.");
        }
    }
}
exports.ResendOtpUseCase = ResendOtpUseCase;
//# sourceMappingURL=ResendOtpUseCase.js.map