import { Request, Response, NextFunction } from 'express';
import { IHandleWebhookUseCase } from '../../../application/interface/use-cases/user/IHandleWebhookUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';

export class WebhookController {
    constructor(
        private readonly _handleWebhookUseCase: IHandleWebhookUseCase
    ) { }

    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const event = req.body;
            await this._handleWebhookUseCase.execute(event);

            res.status(HttpStatusCode.OK).json({
                success: true,
                received: true
            });
        } catch (error) {
            next(error);
        }
    }
}

