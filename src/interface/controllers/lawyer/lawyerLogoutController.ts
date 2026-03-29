import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";
import { getCookieOptions } from "../../../infrastructure/utils/CookieOptions";

export class LawyerLogoutController {
    async handle(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            res.clearCookie('accessToken', getCookieOptions());
            res.clearCookie('refreshToken', getCookieOptions());

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.LOGOUT_SUCCESS);

        } catch (error: unknown) {
            next(error);
        }
    }
}