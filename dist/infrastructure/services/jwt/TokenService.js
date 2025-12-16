"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenService {
    constructor() {
        this.accessSecret = process.env.JWT_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    }
    generateAccessToken(id, role, isBlock) {
        return jsonwebtoken_1.default.sign({ id, role, isBlock }, this.accessSecret, { expiresIn: '15m' });
    }
    // generateToken(id: string, role: string): string {
    //   return this.generateAccessToken({ id, role });
    // }
    generateRefreshToken(id, role, isBlock) {
        return jsonwebtoken_1.default.sign({ id, role, isBlock }, this.refreshSecret, { expiresIn: '7d' });
    }
    verifyToken(token, isRefresh = false) {
        const secret = isRefresh ? this.refreshSecret : this.accessSecret;
        return jsonwebtoken_1.default.verify(token, secret);
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map