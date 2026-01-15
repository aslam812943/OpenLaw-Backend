import { Request, Response, NextFunction } from "express";
import { IGetSubscriptionPlansUseCase } from "../../../application/interface/use-cases/lawyer/IGetSubscriptionPlansUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetCurrentSubscriptionUseCase } from "../../../application/interface/use-cases/lawyer/IGetCurrentSubscriptionUseCase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class SubscriptionController {
    constructor(
        private readonly _getSubscriptionPlansUseCase: IGetSubscriptionPlansUseCase,
        private readonly _getCurrentSubscriptionUseCase: IGetCurrentSubscriptionUseCase
    ) { }

    async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this._getSubscriptionPlansUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.FETCH_SUCCESS,
                data: plans
            });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                res.status(HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: MessageConstants.COMMON.UNAUTHORIZED
                });
                return;
            }
            const subscription = await this._getCurrentSubscriptionUseCase.execute(lawyerId);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.CURRENT_FETCH_SUCCESS,
                data: subscription
            });
        } catch (error) {
            next(error);
        }
    }
}
