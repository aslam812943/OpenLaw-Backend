"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
const LoginUserDTO_1 = require("../../../application/dtos/user/LoginUserDTO");
const ForgetPasswordRequestDTO_1 = require("../../../application/dtos/user/ForgetPasswordRequestDTO");
const RegisterUserDTO_1 = require("../../../application/dtos/user/RegisterUserDTO");
class AuthController {
    constructor(_registerUserCase, verifyOtpUseCase, _loginUserUsecase, _resendOtpUseCase, _requestForgetPasswordUseCase, _verifyResetPasswordUseCase, _googleAuthUseCase) {
        this._registerUserCase = _registerUserCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
        this._loginUserUsecase = _loginUserUsecase;
        this._resendOtpUseCase = _resendOtpUseCase;
        this._requestForgetPasswordUseCase = _requestForgetPasswordUseCase;
        this._verifyResetPasswordUseCase = _verifyResetPasswordUseCase;
        this._googleAuthUseCase = _googleAuthUseCase;
    }
    // ------------------------------------------------------------
    //  Register a new user and send OTP to their email
    // -----------------------------------------------------------
    async registerUser(req, res, next) {
        try {
            const dto = new RegisterUserDTO_1.UserRegisterDTO(req.body);
            const result = await this._registerUserCase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({
                success: true,
                message: result.message || "User registered successfully! OTP sent to email.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ------------------------------------------------------------
    // Verify OTP for user registration
    // ------------------------------------------------------------
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            const result = await this.verifyOtpUseCase.execute(email, otp);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "OTP verified successfully!",
                user: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ------------------------------------------------------------
    //  Resend OTP to user email
    // ------------------------------------------------------------
    async resendOtp(req, res, next) {
        try {
            const { email } = req.body;
            const message = await this._resendOtpUseCase.execute(email);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: message || "OTP resent successfully!",
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ------------------------------------------------------------
    //  Request to reset password (sends OTP to user email)
    // ------------------------------------------------------------
    async requestForgetPassword(req, res, next) {
        try {
            const dto = new ForgetPasswordRequestDTO_1.ForgetPasswordRequestDTO(req.body);
            const message = await this._requestForgetPasswordUseCase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: message || "Password reset OTP sent successfully.",
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ------------------------------------------------------------
    //  Verify reset password OTP and update new password
    // ------------------------------------------------------------
    async verifyResetPassword(req, res, next) {
        try {
            const message = await this._verifyResetPasswordUseCase.execute(req.body);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: message || "Password reset successful!",
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ------------------------------------------------------------
    //  Login user and issue authentication tokens (access + refresh)
    // ------------------------------------------------------------
    async loginUser(req, res, next) {
        try {
            const dto = new LoginUserDTO_1.LoginUserDTO(req.body);
            const { token, refreshToken, user } = await this._loginUserUsecase.execute(dto);
            if (user.role == 'user') {
                res.cookie("userAccessToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.cookie("userRefreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            else {
                res.cookie("lawyerAccessToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.cookie("lawyerRefreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            }
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Login successful.",
                token,
                refreshToken,
                user,
            });
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
    // ------------------------------------------------------------
    // Logout user and clear authentication cookies
    // ------------------------------------------------------------
    async logoutUser(_req, res, next) {
        try {
            res.clearCookie("userAccessToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: '/'
            });
            res.clearCookie("userRefreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: '/'
            });
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "User logged out successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ------------------------------------------------------------
    //  Google Authentication
    // ------------------------------------------------------------
    async googleAuth(req, res, next) {
        try {
            const { token, role } = req.body;
            const result = await this._googleAuthUseCase.execute(token, role);
            if (result.needsRoleSelection) {
                res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                    success: true,
                    message: "Please select a role.",
                    needsRoleSelection: true,
                });
                return;
            }
            // Set Cookies
            if (result.user.role === 'user') {
                res.cookie("userAccessToken", result.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("userRefreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            else {
                res.cookie("lawyerAccessToken", result.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie("lawyerRefreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Google login successful.",
                token: result.token,
                refreshToken: result.refreshToken,
                user: result.user,
                needsVerificationSubmission: result.needsVerificationSubmission
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map