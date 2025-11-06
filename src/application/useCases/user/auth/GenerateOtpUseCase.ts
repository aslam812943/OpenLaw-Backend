import { UserRegisterDTO } from "../../../dtos/user/ RegisterUserDTO";
import { OtpService } from "../../../../infrastructure/services/otp/OtpService";


export class GenerateOtpUseCase {
    constructor(private otpService: OtpService) { }
    async execute(email: string, data: UserRegisterDTO): Promise<string> {
        return await this.otpService.generateOtp(email, data);
    }
}