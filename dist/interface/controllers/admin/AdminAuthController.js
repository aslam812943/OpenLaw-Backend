"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const AdminLoginRequestDTO_1 = __importDefault(require("../../../application/dtos/admin/AdminLoginRequestDTO"));
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
// ✅ AdminAuthController
class AdminAuthController {
    constructor(_loginUseCase) {
        this._loginUseCase = _loginUseCase;
    }
    // ------------------------------------------------------------
    // Admin Login Handler
    // ------------------------------------------------------------
    async login(req, res, next) {
        try {
            const dto = new AdminLoginRequestDTO_1.default(req.body);
            const result = await this._loginUseCase.execute(dto);
            res.cookie("adminAccessToken", result.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.cookie('adminRefreshToken', result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 1 * 24 * 60 * 60 * 1000
            });
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Admin logged in successfully.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(_req, res, next) {
        try {
            res.clearCookie("adminAccessToken", {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.clearCookie('adminRefreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Admin logged out successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=AdminAuthController.js.map