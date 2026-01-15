import { UserRole } from "../../../infrastructure/interface/enums/UserRole";

export interface ITokenService {
  generateAccessToken(id: string, role: UserRole, isBlock: boolean): string;
  // generateToken(id: string, role: string): string;
  generateRefreshToken(id: string, role: UserRole, isBlock: boolean): string;
  verifyToken(token: string, isRefresh?: boolean): any;
}
