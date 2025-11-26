import { RedisCacheService } from "./RedisCacheService";


export class OtpService {
    constructor(private cache: RedisCacheService) { }

    async generateOtp(email: string, data: any): Promise<string> {

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.cache.set(`otp:${email}`, 120, JSON.stringify({ otp, data }))
        return otp;
    }


    async verifyOtp(email: string, otp: string): Promise<any> {
        const stored = await this.cache.get(`otp:${email}`);
        console.log('Stored OTP data:', stored);

        if (!stored) throw new Error('OTP expired or not found');

        const { otp: savedOtp, data } = JSON.parse(stored);

      
        const normalizedSavedOtp = String(savedOtp).trim();
        const normalizedInputOtp = String(otp).trim();

       

        if (normalizedSavedOtp !== normalizedInputOtp) {
            throw new Error('Invalid otp');
        }

        await this.cache.del(`otp:${email}`);
        return data;
    }
}