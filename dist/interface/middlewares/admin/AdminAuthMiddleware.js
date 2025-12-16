"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class AdminAuthMiddleware {
    constructor() {
        this.execute = (req, res, next) => {
            try {
                const token = req.cookies?.adminAccessToken ||
                    req.headers.authorization?.split(" ")[1];
                if (!token) {
                    res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                        success: false,
                        message: "Admin authentication failed. Token missing.",
                    });
                    return;
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (decoded.role !== "admin") {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                        success: false,
                        message: "Access denied. Admin privileges required.",
                    });
                    return;
                }
                req.admin = decoded;
                next();
            }
            catch (error) {
                res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: "Invalid or expired admin token.",
                });
                return;
            }
        };
    }
}
exports.AdminAuthMiddleware = AdminAuthMiddleware;
//# sourceMappingURL=AdminAuthMiddleware.js.map