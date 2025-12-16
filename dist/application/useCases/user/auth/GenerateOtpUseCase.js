"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOtpUseCase = void 0;
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
//  GenerateOtpUseCase
class GenerateOtpUseCase {
    constructor(otpService) {
        this.otpService = otpService;
    }
    async execute(email, data) {
        try {
            if (!email || !data) {
                throw new BadRequestError_1.BadRequestError("Email and user data are required to generate OTP.");
            }
            const otp = await this.otpService.generateOtp(email, data);
            if (!otp) {
                throw new BadRequestError_1.BadRequestError("Failed to generate OTP. Please try again.");
            }
            return otp;
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(error.message || "Unexpected error while generating OTP.");
        }
    }
}
exports.GenerateOtpUseCase = GenerateOtpUseCase;
//# sourceMappingURL=GenerateOtpUseCase.js.map