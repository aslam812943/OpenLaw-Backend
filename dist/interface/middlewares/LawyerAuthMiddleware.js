"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatusCode_1 = require("../../infrastructure/interface/enums/HttpStatusCode");
class LawyerAuthMiddleware {
    constructor(checkLawyerStatusUseCase, tokenService) {
        this.checkLawyerStatusUseCase = checkLawyerStatusUseCase;
        this.tokenService = tokenService;
        this.execute = async (req, res, next) => {
            try {
                let token = req.cookies?.lawyerAccessToken ||
                    req.headers.authorization?.split(" ")[1];
                if (!token) {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "No token provided." });
                    return;
                }
                // Decode JWT
                let decoded;
                try {
                    decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                }
                catch (error) {
                    if (error.name === "TokenExpiredError") {
                        const refreshToken = req.cookies?.lawyerRefreshToken;
                        if (!refreshToken) {
                            res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Session expired. Please login again." });
                            return;
                        }
                        try {
                            const refreshDecoded = this.tokenService.verifyToken(refreshToken, true);
                            if (refreshDecoded.role !== 'lawyer') {
                                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid role." });
                                return;
                            }
                            const newAccessToken = this.tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshToken.isBlock);
                            res.cookie("lawyerAccessToken", newAccessToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                sameSite: "lax",
                                maxAge: 15 * 60 * 1000
                            });
                            decoded = refreshDecoded;
                        }
                        catch (refreshError) {
                            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid refresh token." });
                            return;
                        }
                    }
                    else {
                        throw error;
                    }
                }
                req.user = decoded;
                if (decoded.role !== 'lawyer') {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: "Access denied. Lawyers only." });
                    return;
                }
                const status = await this.checkLawyerStatusUseCase.check(decoded.id);
                if (!status.isActive) {
                    res.clearCookie("lawyerAccessToken", {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        path: '/'
                    });
                    res.clearCookie("lawyerRefreshToken", {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        path: '/'
                    });
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                        success: false,
                        message: "Your account has been blocked or disabled.",
                    });
                    return;
                }
                next();
            }
            catch (error) {
                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid or expired token." });
            }
        };
    }
}
exports.LawyerAuthMiddleware = LawyerAuthMiddleware;
//# sourceMappingURL=LawyerAuthMiddleware.js.map