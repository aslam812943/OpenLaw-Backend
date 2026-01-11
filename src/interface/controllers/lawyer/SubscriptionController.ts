import { Request, Response, NextFunction } from "express";
import { IGetSubscriptionPlansUseCase } from "../../../application/interface/use-cases/lawyer/IGetSubscriptionPlansUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetCurrentSubscriptionUseCase } from "../../../application/interface/use-cases/lawyer/IGetCurrentSubscriptionUseCase";

export class SubscriptionController {
    constructor(
        private getSubscriptionPlansUseCase: IGetSubscriptionPlansUseCase,
        private getCurrentSubscriptionUseCase: IGetCurrentSubscriptionUseCase
    ) { }

    async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this.getSubscriptionPlansUseCase.execute();
            res.status(HttpStatusCode.OK).json({ status: true, data: plans });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: "Unauthorized" });
                return;
            }
            const subscription = await this.getCurrentSubscriptionUseCase.execute(lawyerId);
            res.status(HttpStatusCode.OK).json({ status: true, data: subscription });
        } catch (error) {
            next(error);
        }
    }
}
