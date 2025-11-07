import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenService } from '../../../application/interface/services/TokenServiceInterface';

dotenv.config();

export class TokenService implements ITokenService {
  private accessSecret = process.env.JWT_SECRET!;
  private refreshSecret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string, isRefresh: boolean = false): any {
    const secret = isRefresh ? this.refreshSecret : this.accessSecret;
    return jwt.verify(token, secret);
  }
}
