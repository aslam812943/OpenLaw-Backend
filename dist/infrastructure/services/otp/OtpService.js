"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
class OtpService {
    constructor(cache) {
        this.cache = cache;
    }
    async generateOtp(email, data) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.cache.set(`otp:${email}`, 300, JSON.stringify({ otp, data }));
            return otp;
        }
        catch (error) {
            throw new Error("Failed to generate OTP. Please try again.");
        }
    }
    async verifyOtp(email, otp) {
        try {
            const stored = await this.cache.get(`otp:${email}`);
            if (!stored) {
                throw new Error("OTP expired or does not exist.");
            }
            const { otp: savedOtp, data } = JSON.parse(stored);
            if (savedOtp !== otp) {
                throw new Error("Invalid OTP.");
            }
            await this.cache.del(`otp:${email}`);
            return data;
        }
        catch (error) {
            throw new Error(error.message || "OTP verification failed.");
        }
    }
}
exports.OtpService = OtpService;
//# sourceMappingURL=OtpService.js.map