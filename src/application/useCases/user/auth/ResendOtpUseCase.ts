
import { OtpService } from "../../../../infrastructure/services/otp/OtpService";
import { UserRegisterDTO } from "../../../dtos/user/ RegisterUserDTO";
import { NodeMailerEmailService } from "../../../../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { RedisCacheService } from "../../../../infrastructure/services/otp/RedisCacheService";


export class ResendOtpUseCase {
  constructor(private _redisCacheService: RedisCacheService, private _otpService: OtpService, private _mailService: NodeMailerEmailService) { }


  async execute(email: string): Promise<string> {
    try {
      console.log('resent otp usecase', email);

      // const user = await this._userRepo.findByEmail(email);
      console.log('1');
      // if (!user) throw new Error('User not found');

      // if (user.isVerified) throw new Error('User already verified');

      const redisData = await this._redisCacheService.get(`otp:${email}`);
      console.log('2');
      if (!redisData) {
        throw new Error('No registration data found for this email');
      }

      const { data } = JSON.parse(redisData) as { otp: string; data: UserRegisterDTO };

      const userDto: UserRegisterDTO = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        isVerified: data.isVerified,
        role: data.role,
      };

      const otp = await this._otpService.generateOtp(email, userDto);

      await this._mailService.sendMail(
        email,
        "your OTP  code - Resent",
        `<h2>Your new OTP is ${otp}</h2>`
      );

      return 'OTP resent successfully';
    } catch (err: any) {
      console.error('ResendOtpUseCase error:', err);
      throw err;
    }
  }

}