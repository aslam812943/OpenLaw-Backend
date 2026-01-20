export interface IOtpService<T = unknown> {
    generateOtp(email: string, data: T): Promise<string>;
    verifyOtp(email: string, otp: string): Promise<T | null>;
}
