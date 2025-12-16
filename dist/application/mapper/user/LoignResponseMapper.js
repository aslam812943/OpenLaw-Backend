"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseMapper = void 0;
const LoginResponseDTO_1 = require("../../dtos/user/LoginResponseDTO");
class LoginResponseMapper {
    toDTO(user) {
        console.log('ith', user);
        if (!user.id) {
            throw new Error('User id is missing');
        }
        const userResponse = new LoginResponseDTO_1.LoginResponseDTO({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            hasSubmittedVerification: user.hasSubmittedVerification,
            verificationStatus: user.verificationStatus
        });
        return userResponse;
    }
}
exports.LoginResponseMapper = LoginResponseMapper;
//# sourceMappingURL=LoignResponseMapper.js.map