import { Request, Response, NextFunction } from "express";
import { GetSubscriptionPlansUseCase } from "../../../application/useCases/lawyer/GetSubscriptionPlansUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
export class SubscriptionController {
    constructor(private getSubscriptionPlansUseCase: GetSubscriptionPlansUseCase) { }

    async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this.getSubscriptionPlansUseCase.execute();
            res.status(HttpStatusCode.OK).json({ status: true, data: plans });
        } catch (error) {
            next(error);
        }
    }
}
