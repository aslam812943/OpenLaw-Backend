import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";
import { CheckLawyerStatusUseCase } from "../../application/useCases/lawyer/CheckLawyerStatusUseCase";
import { ITokenService } from "../../application/interface/services/TokenServiceInterface";

interface JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export class LawyerAuthMiddleware {
    constructor(
        private readonly checkLawyerStatusUseCase: CheckLawyerStatusUseCase,
        private readonly tokenService: ITokenService
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

                        const refreshDecoded = this.tokenService.verifyToken(refreshToken, true) as JwtPayload;

                        if (refreshDecoded.role !== 'lawyer') {
                            res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid role." });
                            return;
                        }

                        const newAccessToken = this.tokenService.generateAccessToken(refreshDecoded.id, refreshDecoded.role, refreshToken.isBlock);

                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                            maxAge: 15 * 60 * 1000
                        });

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


            if (decoded.role !== 'lawyer') {
                res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Access denied. Lawyers only." });
                return;
            }


            const status = await this.checkLawyerStatusUseCase.check(decoded.id);

            if (!status.isActive) {

                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: '/'
                });

                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: '/'
                });


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
