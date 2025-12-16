"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDTO = void 0;
class ResetPasswordDTO {
    constructor(data) {
        if (!data.email) {
            throw new Error('A valid email address is required');
        }
        if (!data.otp || data.otp.length !== 6) {
            throw new Error('Valid 6-digit OTP is required');
        }
        const passwordRegex = /^.{8,16}$/;
        if (!data.newPassword || !passwordRegex.test(data.newPassword)) {
            throw new Error("Password must be 8–16 characters ");
        }
        this.email = data.email;
        this.otp = data.otp;
        this.newPassword = data.newPassword;
    }
}
exports.ResetPasswordDTO = ResetPasswordDTO;
//# sourceMappingURL=ResetPasswordDTO.js.map