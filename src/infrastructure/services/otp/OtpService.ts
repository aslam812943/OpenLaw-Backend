import { RedisCacheService } from "../reddis/RedisCacheService";
import { IOtpService } from "../../../application/interface/services/IOtpService";

export class OtpService<T = unknown> implements IOtpService<T> {
  constructor(private cache: RedisCacheService) { }

  async generateOtp(email: string, data: T): Promise<string> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.cache.set(`otp:${email}`, 300, JSON.stringify({ otp, data }));


      return otp;
    } catch (error) {

      throw new Error("Failed to generate OTP. Please try again.");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<T | null> {
    try {


      const stored = await this.cache.get(`otp:${email}`);

      if (!stored) {
        return null;
      }

      const { otp: savedOtp, data } = JSON.parse(stored);

      if (savedOtp !== otp) {
        return null;
      }


      await this.cache.del(`otp:${email}`);

      return data as T;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "OTP verification failed.";
      throw new Error(message);
    }
  }
}
