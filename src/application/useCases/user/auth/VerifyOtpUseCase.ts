import { IUserRepository } from '../../../../domain/repositories/user/ IUserRepository'
import { OtpService } from '../../../../infrastructure/services/otp/OtpService'
import { UserMapper } from '../../../mapper/user/UserMapper'
import bcrypt from 'bcrypt'

export class VerifyOtpUseCase {
  constructor(private _userRepo: IUserRepository, private _otpService: OtpService) { }

  async execute(email: string, otp: string): Promise<any> {
    const userData = await this._otpService.verifyOtp(email, otp);
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.isVerified = true;
    const userEntity = UserMapper.toEntity(userData)
    const savedUser = await this._userRepo.createUser(userEntity);
    return savedUser
  }
}