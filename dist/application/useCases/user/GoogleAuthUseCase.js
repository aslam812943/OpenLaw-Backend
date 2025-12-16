"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUsecase = void 0;
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const UnauthorizedError_1 = require("../../../infrastructure/errors/UnauthorizedError");
const ForbiddenError_1 = require("../../../infrastructure/errors/ForbiddenError");
class GoogleAuthUsecase {
    constructor(_userRepository, _googleAuthService, _tokenService, _lawyerRepo) {
        this._userRepository = _userRepository;
        this._googleAuthService = _googleAuthService;
        this._tokenService = _tokenService;
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(idToken, role) {
        if (!idToken) {
            throw new BadRequestError_1.BadRequestError("Google token is missing.");
        }
        const payload = await this._googleAuthService.verifyToken(idToken);
        if (!payload || !payload.email) {
            throw new UnauthorizedError_1.UnauthorizedError("Invalid Google token.");
        }
        const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;
        let user = await this._userRepository.findByGoogleId(googleId);
        if (!user) {
            user = await this._userRepository.findByEmail(email);
            if (!user) {
                user = await this._lawyerRepo.findByEmail(email);
            }
        }
        if (user) {
            if (user.isBlock) {
                throw new ForbiddenError_1.ForbiddenError("Your account has been blocked. Contact support.");
            }
            if (!user.googleId) {
                user.googleId = googleId;
                if (user.role === 'lawyer') {
                    await this._lawyerRepo.updateGoogleId(user.id, googleId);
                }
                else {
                    user = await this._userRepository.save(user);
                }
            }
        }
        else {
            if (!role) {
                return {
                    needsRoleSelection: true
                };
            }
            const newUser = {
                name: `${firstName} ${lastName}`,
                email: email,
                googleId,
                role,
                hasSubmittedVerification: false,
                isVerified: true,
                isBlock: false
            };
            if (role === 'lawyer') {
                user = await this._lawyerRepo.create(newUser);
            }
            else {
                user = await this._userRepository.createUser(newUser);
            }
        }
        const token = this._tokenService.generateAccessToken(user.id, user.role, user.isBlock);
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.isBlock);
        const response = {
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                phone: user.phone,
                hasSubmittedVerification: user.hasSubmittedVerification,
                verificationStatus: user.verificationStatus
            },
            needsRoleSelection: false
        };
        if (user.role === 'lawyer') {
            response.needsVerificationSubmission = !user.hasSubmittedVerification;
        }
        return response;
    }
}
exports.GoogleAuthUsecase = GoogleAuthUsecase;
//# sourceMappingURL=GoogleAuthUseCase.js.map