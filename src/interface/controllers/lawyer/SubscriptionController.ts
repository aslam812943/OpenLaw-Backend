import { Request, Response, NextFunction } from "express";
import { IGetSubscriptionPlansUseCase } from "../../../application/interface/use-cases/lawyer/IGetSubscriptionPlansUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetCurrentSubscriptionUseCase } from "../../../application/interface/use-cases/lawyer/IGetCurrentSubscriptionUseCase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class SubscriptionController {
    constructor(
        private readonly _getSubscriptionPlansUseCase: IGetSubscriptionPlansUseCase,
        private readonly _getCurrentSubscriptionUseCase: IGetCurrentSubscriptionUseCase
    ) { }

    async getPlans(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
             const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const plans = await this._getSubscriptionPlansUseCase.execute(page,limit);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SUBSCRIPTION.FETCH_SUCCESS, plans);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
                return;
            }
            const subscription = await this._getCurrentSubscriptionUseCase.execute(lawyerId);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SUBSCRIPTION.CURRENT_FETCH_SUCCESS, subscription);
        } catch (error: unknown) {
            next(error);
        }
    }
}
