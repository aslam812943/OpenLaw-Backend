export interface IOtpService {
    generateOtp(email: string, data: any): Promise<string>;
    verifyOtp(email: string, otp: string): Promise<any>;
}
