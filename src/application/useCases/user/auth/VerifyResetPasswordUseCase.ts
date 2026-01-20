
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IOtpService } from "../../../interface/services/IOtpService";
import { ResetPasswordDTO } from "../../../dtos/user/ResetPasswordDTO";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import bcrypt from "bcrypt";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { IVerifyResetPasswordUseCase } from "../../../interface/use-cases/user/IVerifyResetPasswordUseCase";


//  VerifyResetPasswordUseCase

export interface IResetData {
    email: string;
    userId: string;
}

export class VerifyResetPasswordUseCase implements IVerifyResetPasswordUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpService: IOtpService<IResetData>,
        private _lawyerRepository: ILawyerRepository
    ) { }


    async execute(data: ResetPasswordDTO): Promise<string> {
        try {



            if (!data.email || !data.otp || !data.newPassword) {
                throw new BadRequestError("Email, OTP, and new password are required.");
            }


            const stored = await this._otpService.verifyOtp(data.email, data.otp);
            if (!stored) {
                throw new BadRequestError("Invalid or expired OTP. Please request a new one.");
            }


            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            let user = await this._userRepository.findByEmail(stored.email)
            if (user) {
                await this._userRepository.updateUserPassword(stored.userId, hashedPassword);
            }


            await this._lawyerRepository.forgotpassword(stored.userId, hashedPassword)





            return "Password reset successfully.";
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to reset password. Please try again later.";
            throw new BadRequestError(message);
        }
    }
}
