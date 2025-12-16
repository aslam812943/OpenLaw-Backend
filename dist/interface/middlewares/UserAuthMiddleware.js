"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatusCode_1 = require("../../infrastructure/interface/enums/HttpStatusCode");
class UserAuthMiddleware {
    constructor(checkUserStatusUseCase, tokenService) {
        this.checkUserStatusUseCase = checkUserStatusUseCase;
        this.tokenService = tokenService;
        this.execute = async (req, res, next) => {
            try {
                let token = req.cookies?.userAccessToken ||
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
                        const refreshToken = req.cookies?.userRefreshToken;
                        if (!refreshToken) {
                            res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Session expired. Please login again." });
                            return;
                        }
                        try {
                            const refreshDecoded = this.tokenService.verifyToken(refreshToken, true);
                            const newAccessToken = this.tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshToken.isBlock);
                            if (refreshDecoded.role === 'user') {
                                res.cookie("userAccessToken", newAccessToken, {
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === "production",
                                    sameSite: "lax",
                                    maxAge: 15 * 60 * 1000,
                                });
                            }
                            else {
                                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid role for this middleware." });
                                return;
                            }
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
                const status = await this.checkUserStatusUseCase.check(decoded.id);
                if (!status.isActive) {
                    if (decoded.role == 'user') {
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
                    }
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
exports.UserAuthMiddleware = UserAuthMiddleware;
//# sourceMappingURL=UserAuthMiddleware.js.map