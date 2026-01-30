import { Request, Response, NextFunction } from "express";
import { ICreateSubscriptionCheckoutUseCase } from "../../../application/interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { IVerifySubscriptionPaymentUseCase } from "../../../application/interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";
import { CreateSubscriptionCheckoutDTO } from "../../../application/dtos/lawyer/CreateSubscriptionCheckoutDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class SubscriptionPaymentController {
    constructor(
        private readonly _createSubscriptionCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
        private readonly _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase
    ) { }

    async createCheckout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { lawyerId, email, planName, price, subscriptionId } = req.body;

            if (!lawyerId || !planName || !price || !subscriptionId) {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
            }

            const dto = new CreateSubscriptionCheckoutDTO(lawyerId, email, planName, price, subscriptionId);
            const url = await this._createSubscriptionCheckoutUseCase.execute(dto);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SUBSCRIPTION.CHECKOUT_SESSION_CREATE_SUCCESS, { url });
        } catch (error: unknown) {
            next(error);
        }
    }

    async handleSuccess(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { session_id } = req.body;

            if (!session_id) {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
                
            }

            const success = await this._verifySubscriptionPaymentUseCase.execute(session_id);
            if (success) {
                return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS);
            } else {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
            }
        } catch (error: unknown) {
            next(error);
        }
    }
}
