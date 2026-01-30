import { Request, Response, NextFunction } from 'express';
import { IHandleWebhookUseCase } from '../../../application/interface/use-cases/user/IHandleWebhookUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class WebhookController {
    constructor(
        private readonly _handleWebhookUseCase: IHandleWebhookUseCase
    ) { }

    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const event = req.body;
            await this._handleWebhookUseCase.execute(event);

            return ApiResponse.success(res, HttpStatusCode.OK, "Webhook processed successfully", { received: true });
        } catch (error: unknown) {
            next(error);
        }
    }
}

