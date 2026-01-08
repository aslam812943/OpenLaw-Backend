import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";



export class LawyerLogoutController {
    async handle(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {



            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            })

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            })

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer logged out successfully.",
            });

        } catch (error) {
            next(error)
        }
    }
}