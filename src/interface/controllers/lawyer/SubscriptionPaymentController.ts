import { Request, Response, NextFunction } from "express";
import { ICreateSubscriptionCheckoutUseCase } from "../../../application/interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { IVerifySubscriptionPaymentUseCase } from "../../../application/interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";
import { CreateSubscriptionCheckoutDTO } from "../../../application/dtos/lawyer/CreateSubscriptionCheckoutDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class SubscriptionPaymentController {
    constructor(
        private readonly _createSubscriptionCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
        private readonly _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase
    ) { }

    async createCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { lawyerId, email, planName, price, subscriptionId } = req.body;

            if (!lawyerId || !planName || !price || !subscriptionId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: MessageConstants.COMMON.BAD_REQUEST
                });
                return;
            }

            const dto = new CreateSubscriptionCheckoutDTO(lawyerId, email, planName, price, subscriptionId);
            const url = await this._createSubscriptionCheckoutUseCase.execute(dto);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.CHECKOUT_SESSION_CREATE_SUCCESS,
                data: { url }
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async handleSuccess(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { session_id } = req.body;

            if (!session_id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: MessageConstants.COMMON.BAD_REQUEST
                });
                return;
            }

            const success = await this._verifySubscriptionPaymentUseCase.execute(session_id);
            if (success) {
                res.status(HttpStatusCode.OK).json({
                    success: true,
                    message: MessageConstants.COMMON.SUCCESS
                });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: MessageConstants.COMMON.BAD_REQUEST
                });
            }
        } catch (error: unknown) {
            next(error);
        }
    }
}
