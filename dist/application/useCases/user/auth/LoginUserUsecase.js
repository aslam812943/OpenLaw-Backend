"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUsecase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../../infrastructure/errors/NotFoundError");
const ForbiddenError_1 = require("../../../../infrastructure/errors/ForbiddenError");
const UnauthorizedError_1 = require("../../../../infrastructure/errors/UnauthorizedError");
// LoginUserUsecase
class LoginUserUsecase {
    constructor(_userRepo, _LoginResponseMapper, _tokenService, _lawyerRepo) {
        this._userRepo = _userRepo;
        this._LoginResponseMapper = _LoginResponseMapper;
        this._tokenService = _tokenService;
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(data) {
        try {
            if (!data.email || !data.password) {
                throw new BadRequestError_1.BadRequestError("Email and password are required for login.");
            }
            let user = await this._userRepo.findByEmail(data.email);
            if (!user) {
                user = await this._lawyerRepo.findByEmail(data.email);
            }
            if (!user) {
                throw new NotFoundError_1.NotFoundError("No user found with this email.");
            }
            if (!user.isVerified) {
                throw new ForbiddenError_1.ForbiddenError("User email not verified. Please verify your account before login.");
            }
            if (user.isBlock) {
                throw new ForbiddenError_1.ForbiddenError("User account is blocked. Contact support for assistance.");
            }
            const isMatch = await bcrypt_1.default.compare(data.password, String(user.password));
            if (!isMatch) {
                throw new UnauthorizedError_1.UnauthorizedError("Invalid password. Please check your credentials.");
            }
            const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.isBlock);
            const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.isBlock);
            return {
                user: this._LoginResponseMapper.toDTO(user),
                token: accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw new Error(error.message || "Unexpected error occurred during user login.");
        }
    }
}
exports.LoginUserUsecase = LoginUserUsecase;
//# sourceMappingURL=LoginUserUsecase.js.map