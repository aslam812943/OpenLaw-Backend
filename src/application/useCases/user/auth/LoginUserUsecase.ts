import { IUserRepository } from "../../../../domain/repositories/user/ IUserRepository";
import bcrypt from 'bcrypt';
import { LoginUserDTO } from "../../../dtos/user/LoginUserDTO";
// import { User } from "../../../../domain/entities/ User";
import { LoginResponseMapper } from "../../../mapper/user/LoignResponseMapper";
import { LoginResponseDTO } from "../../../dtos/user/LoginResponseDTO";
import {ITokenService} from '../../../interface/services/TokenServiceInterface'
export class LoginUserUsecase {
  constructor(private _userRepo: IUserRepository, private _LoginResponseMapper: LoginResponseMapper,private _tokenService:ITokenService) { }

  async execute(data: LoginUserDTO): Promise<{ token: string; refreshToken: string; user: LoginResponseDTO }> {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user) throw new Error('No user found with this email');
    if (!user.isVerified) throw new Error('User email not verified');
    if(user.isBlock) throw new Error('User is blocked')
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid password');

  

    const accessToken = this._tokenService.generateAccessToken({id:user.id,role:user.role})
    const refreshToken  = this._tokenService.generateRefreshToken({id:user.id})


    return {
      user:this._LoginResponseMapper.toDTO(user),
      token:accessToken,refreshToken
    }
  }
}
