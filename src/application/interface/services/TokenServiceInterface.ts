export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateToken(id: string, role: string): string;
  generateRefreshToken(id: string, role: string): string;
  verifyToken(token: string, isRefresh?: boolean): any;
}
