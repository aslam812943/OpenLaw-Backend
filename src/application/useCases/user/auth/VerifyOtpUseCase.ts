
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import { IOtpService } from "../../../interface/services/IOtpService";
import { UserMapper } from "../../../mapper/user/UserMapper";
import bcrypt from "bcrypt";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { IVerifyOtpUseCase } from "../../../interface/use-cases/user/IVerifyOtpUseCase";


//  VerifyOtpUseCase

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _lawyerRepo: ILawyerRepository,
    private _otpService: IOtpService
  ) { }


  async execute(email: string, otp: string): Promise<any> {

    try {


      if (!email || !otp) {
        throw new BadRequestError("Email and OTP are required for verification.");
      }

      const userData = await this._otpService.verifyOtp(email, otp);

      if (!userData) {
        throw new BadRequestError("Invalid or expired OTP. Please request a new one.");
      }


      userData.password = await bcrypt.hash(userData.password, 10);


      userData.isVerified = true;


      const userEntity = UserMapper.toEntity(userData);

      let savedUser;
      if (userData.role === 'lawyer') {
        savedUser = await this._lawyerRepo.create(userEntity);

      } else {
        savedUser = await this._userRepo.createUser(userEntity);
      }

      return savedUser;
    } catch (error: any) {



      throw new BadRequestError(
        error.message || "OTP verification failed. Please try again later."
      );
    }
  }
}
