"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOTPDTO = void 0;
class VerifyOTPDTO {
    constructor(data) {
        if (!data.email)
            throw new Error('Email is required');
        if (data.otp || data.otp?.length !== 6)
            throw new Error('valid 6-digit OTP is required');
        this.email = data.email;
        this.otp = data.otp;
    }
}
exports.VerifyOTPDTO = VerifyOTPDTO;
//# sourceMappingURL=VerifyOTPDTO.js.map