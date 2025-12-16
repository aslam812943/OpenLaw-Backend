"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyResetPasswordUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
//  VerifyResetPasswordUseCase
class VerifyResetPasswordUseCase {
    constructor(_userRepository, _otpService, _lawyerRepo) {
        this._userRepository = _userRepository;
        this._otpService = _otpService;
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(data) {
        try {
            if (!data.email || !data.otp || !data.newPassword) {
                throw new BadRequestError_1.BadRequestError("Email, OTP, and new password are required.");
            }
            const stored = await this._otpService.verifyOtp(data.email, data.otp);
            if (!stored) {
                throw new BadRequestError_1.BadRequestError("Invalid or expired OTP. Please request a new one.");
            }
            const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
            let user = await this._userRepository.findByEmail(stored.email);
            if (user) {
                await this._userRepository.updateUserPassword(stored.userId, hashedPassword);
            }
            await this._lawyerRepo.forgotpassword(stored.userId, hashedPassword);
            return "Password reset successfully.";
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(error.message || "Failed to reset password. Please try again later.");
        }
    }
}
exports.VerifyResetPasswordUseCase = VerifyResetPasswordUseCase;
//# sourceMappingURL=VerifyResetPasswordUseCase.js.map