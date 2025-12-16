"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapper = void 0;
const AdminLoginResponseDTO_1 = __importDefault(require("../../dtos/admin/AdminLoginResponseDTO"));
class AdminMapper {
    static toLoginResponse(admin, token, refreshToken) {
        return new AdminLoginResponseDTO_1.default({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token,
            refreshToken
        });
    }
}
exports.AdminMapper = AdminMapper;
//# sourceMappingURL=AdminMapper.js.map