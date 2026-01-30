import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerLogoutController {
    async handle(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.LOGOUT_SUCCESS);

        } catch (error: unknown) {
            next(error);
        }
    }
}