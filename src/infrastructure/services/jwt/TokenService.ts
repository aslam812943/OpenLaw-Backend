import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenService } from '../../../application/interface/services/TokenServiceInterface';
import { UserRole } from '../../interface/enums/UserRole';

dotenv.config();

export class TokenService implements ITokenService {
  private accessSecret = process.env.JWT_SECRET!;
  private refreshSecret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(id: string, role: UserRole, isBlock: boolean): string {
    return jwt.sign({ id, role, isBlock }, this.accessSecret, { expiresIn: '15m' });
  }

  // generateToken(id: string, role: string): string {
  //   return this.generateAccessToken({ id, role });
  // }

  generateRefreshToken(id: string, role: UserRole, isBlock: boolean): string {
    return jwt.sign({ id, role, isBlock }, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string, isRefresh: boolean = false): any {
    const secret = isRefresh ? this.refreshSecret : this.accessSecret;
    return jwt.verify(token, secret);
  }
}
