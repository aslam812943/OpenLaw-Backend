"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminLoginResponseDTO {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.token = data.token;
        this.refreshToken = data.refreshToken;
    }
}
exports.default = AdminLoginResponseDTO;
//# sourceMappingURL=AdminLoginResponseDTO.js.map