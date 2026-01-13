import { RedisCacheService } from "./RedisCacheService";
import { IOtpService } from "../../../application/interface/services/IOtpService";

export class OtpService implements IOtpService {
  constructor(private cache: RedisCacheService) { }

  async generateOtp(email: string, data: any): Promise<string> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.cache.set(`otp:${email}`, 300, JSON.stringify({ otp, data }));


      return otp;
    } catch (error) {

      throw new Error("Failed to generate OTP. Please try again.");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
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
    } catch (error: any) {

      throw new Error(error.message || "OTP verification failed.");
    }
  }
}
