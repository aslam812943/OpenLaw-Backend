"use strict";
// DTO Interface Loign response
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDTO = void 0;
// DTO Class Login Response
class LoginResponseDTO {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.role = data.role;
        this.hasSubmittedVerification = data.hasSubmittedVerification;
        this.verificationStatus = data.verificationStatus;
    }
}
exports.LoginResponseDTO = LoginResponseDTO;
//# sourceMappingURL=LoginResponseDTO.js.map