
import { IUserRepository } from "../../../../domain/repositories/user/ IUserRepository";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "../../../dtos/user/LoginUserDTO";
import { LoginResponseMapper } from "../../../mapper/user/LoignResponseMapper";
import { LoginResponseDTO } from "../../../dtos/user/LoginResponseDTO";
import { ITokenService } from "../../../interface/services/TokenServiceInterface";


// LoginUserUsecase

export class LoginUserUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _LoginResponseMapper: LoginResponseMapper,
    private _tokenService: ITokenService
  ) { }


  async execute(
    data: LoginUserDTO
  ): Promise<{ token: string; refreshToken: string; user: LoginResponseDTO }> {
    try {

      if (!data.email || !data.password) {
        throw new Error("Email and password are required for login.");
      }


      const user = await this._userRepo.findByEmail(data.email);
      if (!user) {
        throw new Error("No user found with this email.");
      }


      if (!user.isVerified) {
        throw new Error("User email not verified. Please verify your account before login.");
      }

      if (user.isBlock) {
        throw new Error("User account is blocked. Contact support for assistance.");
      }


      const isMatch = await bcrypt.compare(data.password, String(user.password));
      if (!isMatch) {
        throw new Error("Invalid password. Please check your credentials.");
      }


      const accessToken = this._tokenService.generateAccessToken({
        id: user.id,
        role: user.role,
      });
      const refreshToken = this._tokenService.generateRefreshToken(
        user.id!,
        user.role!
      );


      return {
        user: this._LoginResponseMapper.toDTO(user),
        token: accessToken,
        refreshToken,
      };
    } catch (error: any) {



      throw new Error(
        error.message || "Unexpected error occurred during user login."
      );
    }
  }
}
