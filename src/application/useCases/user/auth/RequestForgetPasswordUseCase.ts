import { IUserRepository } from "../../../../domain/repositories/user/ IUserRepository";
import { OtpService } from "../../../../infrastructure/services/otp/OtpService";
import { NodeMailerEmailService } from "../../../../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { ForgetPasswordRequestDTO } from "../../../dtos/user/ForgetPasswordRequestDTO";




export class RequestForgetPasswordUseCase {
    constructor(private _userRepo: IUserRepository, private _otpService: OtpService, private _mailService: NodeMailerEmailService) { }

    async execute(data: ForgetPasswordRequestDTO): Promise<string> {
        const user = await this._userRepo.findByEmail(data.email);

        if (!user) throw new Error('User not found');

        const otp = await this._otpService.generateOtp(data.email, {
            email: data.email,
            userId: user.id
        })

        // Send OTP via email
        await this._mailService.sendMail(
            data.email,
            "Password Reset OTP",
            `<h2>Your password reset OTP is ${otp}</h2>`
        );
        return "Password reset OTP sent successfully.";

    }

}