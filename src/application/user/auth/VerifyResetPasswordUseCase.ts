import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { OtpService } from "../../../infrastructure/services/otp/OtpService";
import { ResetPasswordDTO } from "../../dtos/user/ResetPasswordDTO";
import bcrypt from 'bcrypt'


export class VerifyResetPasswordUseCase{
    constructor(private _userRepository:IUserRepository,private _otpService:OtpService){}
    async execute(data:ResetPasswordDTO):Promise <string>
{
 
    const stored = await this._otpService.verifyOtp(data.email,data.otp);
    if(!stored){
        throw new Error('Invalid or expaired Otp');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword,10);
    await this._userRepository.updateUserPassword(stored.userId,hashedPassword);
    return 'password reset successfully'
}}