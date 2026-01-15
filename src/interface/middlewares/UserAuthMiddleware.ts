import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";
import { CheckUserStatusUseCase } from "../../application/useCases/user/checkUserStatusUseCase";
import { ITokenService } from "../../application/interface/services/TokenServiceInterface";

import { UserRole } from "../../infrastructure/interface/enums/UserRole";
import { JwtPayload } from "../../types/express/index";

export class UserAuthMiddleware {
  constructor(
    private readonly _checkUserStatusUseCase: CheckUserStatusUseCase,
    private readonly _tokenService: ITokenService
  ) { }

  execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      let token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {

        res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "No token provided." });
        return;
      }

      // Decode JWT
      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      } catch (error: any) {

        if (error.name === "TokenExpiredError") {

          const refreshToken = req.cookies?.refreshToken;

          if (!refreshToken) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "Session expired. Please login again." });
            return;
          }

          try {

            const refreshDecoded = this._tokenService.verifyToken(refreshToken, true) as JwtPayload;


            const newAccessToken = this._tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshToken.isBlock);

            if (refreshDecoded.role === UserRole.USER) {

              const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

              res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.COOKIE_SECURE === 'true',
                sameSite: cookieSameSite,
                path: '/',
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
              });
            } else {

              res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid role for this middleware." });
              return;
            }


            decoded = refreshDecoded;
          } catch (refreshError) {

            res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid refresh token." });
            return;
          }
        } else {
          throw error;
        }
      }

      req.user = decoded;





      const status = await this._checkUserStatusUseCase.check(decoded.id);

      if (!status.isActive) {
        const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

        if (decoded.role == UserRole.USER) {
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: cookieSameSite,
            path: '/'
          });

          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: cookieSameSite,
            path: '/'
          });
        }

        res.status(HttpStatusCode.FORBIDDEN).json({

          success: false,
          message: "Your account has been blocked or disabled.",
        });

        return;
      }

      next();
    } catch (error) {

      res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid or expired token." });
    }
  };
}
