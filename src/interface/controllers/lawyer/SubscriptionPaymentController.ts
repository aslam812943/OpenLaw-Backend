import { Request, Response, NextFunction } from "express";
import { ICreateSubscriptionCheckoutUseCase } from "../../../application/interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { IVerifySubscriptionPaymentUseCase } from "../../../application/interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";
import { CreateSubscriptionCheckoutDTO } from "../../../application/dtos/lawyer/CreateSubscriptionCheckoutDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class SubscriptionPaymentController {
    constructor(
        private _createSubscriptionCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
        private _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase
    ) { }

    async createCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { lawyerId, email, planName, price, subscriptionId } = req.body;

            if (!lawyerId || !planName || !price || !subscriptionId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
                return;
            }

            const dto = new CreateSubscriptionCheckoutDTO(lawyerId, email, planName, price, subscriptionId);
            const url = await this._createSubscriptionCheckoutUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({ success: true, url });
        } catch (error) {
            next(error);
        }
    }

    async handleSuccess(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { session_id } = req.body;

            if (!session_id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Session ID required" });
                return;
            }

            const success = await this._verifySubscriptionPaymentUseCase.execute(session_id);
            if (success) {
                res.status(HttpStatusCode.OK).json({ success: true, message: "Subscription verified successfully" });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "Payment verification failed" });
            }
        } catch (error) {
            next(error);
        }
    }
}
