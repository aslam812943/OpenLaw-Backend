"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDTO = void 0;
class LoginUserDTO {
    constructor(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            throw new Error("A valid email address is required");
        }
        if (!data.password) {
            throw new Error("Password must be provided");
        }
        this.email = data.email;
        this.password = data.password;
    }
}
exports.LoginUserDTO = LoginUserDTO;
//# sourceMappingURL=LoginUserDTO.js.map