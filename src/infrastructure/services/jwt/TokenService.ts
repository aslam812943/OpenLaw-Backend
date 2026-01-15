import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenService } from '../../../application/interface/services/TokenServiceInterface';
import { UserRole } from '../../interface/enums/UserRole';

dotenv.config();

export class TokenService implements ITokenService {
  private _accessSecret = process.env.JWT_SECRET!;
  private _refreshSecret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(id: string, role: UserRole, isBlock: boolean): string {
    return jwt.sign({ id, role, isBlock }, this._accessSecret, { expiresIn: '15m' });
  }

  // generateToken(id: string, role: string): string {
  //   return this.generateAccessToken({ id, role });
  // }

  generateRefreshToken(id: string, role: UserRole, isBlock: boolean): string {
    return jwt.sign({ id, role, isBlock }, this._refreshSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string, isRefresh: boolean = false): any {
    const secret = isRefresh ? this._refreshSecret : this._accessSecret;
    return jwt.verify(token, secret);
  }
}
