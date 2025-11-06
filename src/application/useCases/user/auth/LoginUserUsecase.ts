import { IUserRepository } from "../../../../domain/repositories/user/ IUserRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginUserDTO } from "../../../dtos/user/LoginUserDTO";
import { User } from "../../../../domain/entities/ User";
import { LoginResponseMapper } from "../../../mapper/user/LoignResponseMapper";
import { LoginResponseDTO } from "../../../dtos/user/LoginResponseDTO";

export class LoginUserUsecase {
  constructor(private _userRepo: IUserRepository, private _LoginResponseMapper: LoginResponseMapper) { }

  async execute(data: LoginUserDTO): Promise<{ token: string; refreshToken: string; user: LoginResponseDTO }> {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user) throw new Error('No user found with this email');
    if (!user.isVerified) throw new Error('User email not verified');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid password');

    const userResponse = this._LoginResponseMapper.toDTO(user);

    // Generate Access Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' } // Short-lived token
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' } // Longer-lived token
    );
    console.log(userResponse)
    return { token, refreshToken, user: userResponse };
  }
}
