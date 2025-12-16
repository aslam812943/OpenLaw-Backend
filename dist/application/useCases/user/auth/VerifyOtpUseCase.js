"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUseCase = void 0;
const UserMapper_1 = require("../../../mapper/user/UserMapper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
//  VerifyOtpUseCase
class VerifyOtpUseCase {
    constructor(_userRepo, _lawyerRepo, _otpService) {
        this._userRepo = _userRepo;
        this._lawyerRepo = _lawyerRepo;
        this._otpService = _otpService;
    }
    async execute(email, otp) {
        try {
            if (!email || !otp) {
                throw new BadRequestError_1.BadRequestError("Email and OTP are required for verification.");
            }
            const userData = await this._otpService.verifyOtp(email, otp);
            if (!userData) {
                throw new BadRequestError_1.BadRequestError("Invalid or expired OTP. Please request a new one.");
            }
            userData.password = await bcrypt_1.default.hash(userData.password, 10);
            userData.isVerified = true;
            const userEntity = UserMapper_1.UserMapper.toEntity(userData);
            let savedUser;
            if (userData.role === 'lawyer') {
                savedUser = await this._lawyerRepo.create(userEntity);
            }
            else {
                savedUser = await this._userRepo.createUser(userEntity);
            }
            return savedUser;
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(error.message || "OTP verification failed. Please try again later.");
        }
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
//# sourceMappingURL=VerifyOtpUseCase.js.map