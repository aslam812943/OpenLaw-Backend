"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminLoginRequestDTO {
    constructor(data) {
        if (!data.email)
            throw new Error("Email is required");
        if (!data.password)
            throw new Error("Password is required");
        this.email = data.email;
        this.password = data.password;
    }
}
exports.default = AdminLoginRequestDTO;
//# sourceMappingURL=AdminLoginRequestDTO.js.map