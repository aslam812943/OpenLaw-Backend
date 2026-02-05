import { Request, Response, NextFunction } from "express";
import { IGetWalletUseCase } from "../../../application/interface/use-cases/user/IGetWalletUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class WalletController {
    constructor(private readonly _getWalletUseCase: IGetWalletUseCase) { }

    async getWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const walletData = await this._getWalletUseCase.execute(userId, page, limit);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS, walletData);
        } catch (error: unknown) {
            next(error);
        }
    }
}
