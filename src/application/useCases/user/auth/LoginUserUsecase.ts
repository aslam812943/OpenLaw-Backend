
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "../../../dtos/user/LoginUserDTO";
import { ILoginResponseMapper } from "../../../mapper/user/LoignResponseMapper"; 
import { LoginResponseDTO } from "../../../dtos/user/LoginResponseDTO";
import { ITokenService } from "../../../interface/services/TokenServiceInterface";
import { ILawyerRepository } from '../../../../domain/repositories/lawyer/ILawyerRepository'
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ForbiddenError } from "../../../../infrastructure/errors/ForbiddenError";
import { UnauthorizedError } from "../../../../infrastructure/errors/UnauthorizedError";
import { User } from "../../../../domain/entities/User";
import { Lawyer } from "../../../../domain/entities/Lawyer";
import { ILoginUserUseCase } from "../../../interface/use-cases/user/ILoginUserUseCase";


// LoginUserUsecase

export class LoginUserUsecase implements ILoginUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _LoginResponseMapper: ILoginResponseMapper,
    private _tokenService: ITokenService,
    private _lawyerRepository: ILawyerRepository
  ) { }


  async execute(data: LoginUserDTO): Promise<{ token: string; refreshToken: string; user: LoginResponseDTO }> {


    if (!data.email || !data.password) {
      throw new BadRequestError("Email and password are required for login.");
    }
    let user: User | Lawyer | null = await this._userRepository.findByEmail(data.email);
    if (!user) {
      user = await this._lawyerRepository.findByEmail(data.email);

    }

    if (!user) {

      throw new NotFoundError("No user found with this email.");
    }


    if (!user.isVerified) {

      throw new ForbiddenError("User email not verified. Please verify your account before login.");
    }

    if (user.isBlock) {
      throw new ForbiddenError("User account is blocked. Contact support for assistance.");
    }


    const isMatch = await bcrypt.compare(data.password, String(user.password));

    if (!isMatch) {
      throw new UnauthorizedError("Invalid password. Please check your credentials.");
    }


    const accessToken = this._tokenService.generateAccessToken(
      user.id!,
      user.role,
      user.isBlock
    );
    const refreshToken = this._tokenService.generateRefreshToken(
      user.id!,
      user.role!,
      user.isBlock!
    );


    return {
      user: this._LoginResponseMapper.toDTO(user as User),
      token: accessToken,
      refreshToken,
    };
  }
}
