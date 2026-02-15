import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../../application/interface/services/TokenServiceInterface';
import { UserRole } from '../../interface/enums/UserRole';

export class TokenService implements ITokenService {
  private get _accessSecret(): string {
    return process.env.JWT_SECRET!;
  }
  private get _refreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET!;
  }

  generateAccessToken(id: string, role: UserRole, isBlock: boolean): string {
    const expiresIn = process.env.ACCESS_TOKEN_MAX_AGE
      ? Math.floor(Number(process.env.ACCESS_TOKEN_MAX_AGE) / 1000)
      : '15m';
    return jwt.sign({ id, role, isBlock }, this._accessSecret, { expiresIn });
  }

  // generateToken(id: string, role: string): string {
  //   return this.generateAccessToken({ id, role });
  // }

  generateRefreshToken(id: string, role: UserRole, isBlock: boolean): string {
    const expiresIn = process.env.REFRESH_TOKEN_MAX_AGE
      ? Math.floor(Number(process.env.REFRESH_TOKEN_MAX_AGE) / 1000)
      : '7d';
    return jwt.sign({ id, role, isBlock }, this._refreshSecret, { expiresIn });
  }

  verifyToken(token: string, isRefresh: boolean = false): TokenPayload {
    const secret = isRefresh ? this._refreshSecret : this._accessSecret;
    return jwt.verify(token, secret) as TokenPayload;
  }
}
