// ✅ Import necessary dependencies and modules
import { IUserRepository } from "../../../../domain/repositories/user/ IUserRepository";
import { OtpService } from "../../../../infrastructure/services/otp/OtpService";
import { UserMapper } from "../../../mapper/user/UserMapper";
import bcrypt from "bcrypt";


//  VerifyOtpUseCase

export class VerifyOtpUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpService: OtpService
  ) {}

 
  async execute(email: string, otp: string): Promise<any> {
    
    try {
   


      if (!email || !otp) {
        throw new Error("Email and OTP are required for verification.");
      }

      const userData = await this._otpService.verifyOtp(email, otp);

      if (!userData) {
        throw new Error("Invalid or expired OTP. Please request a new one.");
      }

 
      userData.password = await bcrypt.hash(userData.password, 10);

      
      userData.isVerified = true;

     
      const userEntity = UserMapper.toEntity(userData);

      
      const savedUser = await this._userRepo.createUser(userEntity);

  

    
      return savedUser;
    } catch (error: any) {


      
      throw new Error(
        error.message || "OTP verification failed. Please try again later."
      );
    }
  }
}
