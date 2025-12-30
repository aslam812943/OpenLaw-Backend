import { Request, Response, NextFunction } from 'express';
import { IHandleWebhookUseCase } from '../../../application/interface/use-cases/user/IHandleWebhookUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';

/**
 * WebhookController
 * 
 * Single Responsibility: Handles HTTP requests for Stripe webhooks
 * Dependency Inversion: Depends on IHandleWebhookUseCase abstraction
 */
export class WebhookController {
    constructor(
        private handleWebhookUseCase: IHandleWebhookUseCase
    ) {}

    /**
     * Handles incoming Stripe webhook events
     * This endpoint should be configured in Stripe dashboard to receive webhook events
     * 
     * Note: req.body contains the verified Stripe event (set by webhookSignatureVerification middleware)
     */
    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // req.body is already verified and parsed by webhookSignatureVerification middleware
            const event = req.body;

            // Handle the webhook event
            await this.handleWebhookUseCase.execute(event);

            // Always return 200 to Stripe to acknowledge receipt
            // Stripe will retry if we return an error status
            res.status(HttpStatusCode.OK).json({ received: true });
        } catch (error) {
            console.error('Webhook handling error:', error);
            next(error);
        }
    }
}

