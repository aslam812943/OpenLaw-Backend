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

            const wallet = await this._getWalletUseCase.execute(userId);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS, wallet);
        } catch (error: unknown) {
            next(error);
        }
    }
}
