import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class LawyerLogoutController {
    async handle(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.COOKIE_SECURE === 'true',
                sameSite: 'lax',
                domain: process.env.COOKIE_DOMAIN,
                path: '/'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.COOKIE_SECURE === 'true',
                sameSite: 'lax',
                domain: process.env.COOKIE_DOMAIN,
                path: '/'
            });

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.LOGOUT_SUCCESS,
            });

        } catch (error: unknown) {
            next(error);
        }
    }
}