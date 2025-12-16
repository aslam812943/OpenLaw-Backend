"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toEntity(dto) {
        return {
            name: dto.name,
            email: dto.email,
            password: String(dto.password),
            phone: Number(dto.phone),
            isVerified: dto.isVerified ?? false,
            role: dto.role ?? "user",
            isBlock: dto.isBlock,
            hasSubmittedVerification: false
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=UserMapper.js.map