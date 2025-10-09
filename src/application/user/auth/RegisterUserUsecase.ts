import { UserRegisterDTO } from "../../dtos/user/ RegisterUserDTO"; 
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository"; 
import { IRegisterUserUseCase } from "../../interface/user/IRegisterUserUseCase"; 
import { GenerateOtpUseCase } from "./GenerateOtpUseCase";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";

export class RegisterUserUsecase implements IRegisterUserUseCase {
  constructor(private _userRepo: IUserRepository,private _generateOptUseCase:GenerateOtpUseCase,private _mailService:NodeMailerEmailService) {}

  async execute(data: UserRegisterDTO): Promise<{ message: string }> {
    const existingUser = await this._userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const otp = await this._generateOptUseCase.execute(data.email,data);

    await this._mailService.sendMail(
      data.email,
      'your OTP code',
      `<h2> your OTP is ${otp}</h2>`
    )


    return {message:'OTP sent successfully'}
  }

 
}
