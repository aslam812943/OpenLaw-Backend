import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";
import { ICheckUserStatusUseCase } from "../../application/interface/use-cases/user/ICheckUserStatusUseCase";
import { ITokenService } from "../../application/interface/services/TokenServiceInterface";
import { MessageConstants } from "../../infrastructure/constants/MessageConstants";

import { UserRole } from "../../infrastructure/interface/enums/UserRole";
import { JwtPayload } from "../../types/express/index";

export class UserAuthMiddleware {
  constructor(
    private readonly _checkUserStatusUseCase: ICheckUserStatusUseCase,
    private readonly _tokenService: ITokenService
  ) { }

  execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

      let decoded: JwtPayload;

      if (!token) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: MessageConstants.AUTH.TOKEN_MISSING });
          return;
        }

        try {
          const refreshDecoded = this._tokenService.verifyToken(refreshToken, true);
          if (refreshDecoded.role !== UserRole.USER) {
            res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: MessageConstants.AUTH.INVALID_ROLE });
            return;
          }

          const newAccessToken = this._tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshDecoded.isBlock);
          const cookieSameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: cookieSameSite,
            path: '/',
            maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000,
          });

          decoded = refreshDecoded;
        } catch (refreshError) {
          res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: MessageConstants.AUTH.SESSION_EXPIRED });
          return;
        }
      } else {
        // Decode JWT
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "TokenExpiredError") {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
              res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: MessageConstants.AUTH.SESSION_EXPIRED });
              return;
            }

            try {
              const refreshDecoded = this._tokenService.verifyToken(refreshToken, true);

              const newAccessToken = this._tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshDecoded.isBlock);

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
                res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: MessageConstants.AUTH.INVALID_ROLE });
                return;
              }

              decoded = refreshDecoded;
            } catch (refreshError) {
              res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: MessageConstants.AUTH.INVALID_REFRESH_TOKEN });
              return;
            }
          } else {
            throw error;
          }
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
          message: MessageConstants.AUTH.ACCOUNT_BLOCKED,
        });

        return;
      }

      next();
    } catch (error) {

      res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: MessageConstants.AUTH.INVALID_TOKEN });
    }
  };
}
