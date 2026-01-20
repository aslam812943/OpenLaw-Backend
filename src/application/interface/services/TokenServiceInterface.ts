import { UserRole } from "../../../infrastructure/interface/enums/UserRole";

export interface TokenPayload {
  id: string;
  role: UserRole;
  isBlock: boolean;
  iat?: number;
  exp?: number;
}

export interface ITokenService {
  generateAccessToken(id: string, role: UserRole, isBlock: boolean): string;
  generateRefreshToken(id: string, role: UserRole, isBlock: boolean): string;
  verifyToken(token: string, isRefresh?: boolean): TokenPayload;
}

