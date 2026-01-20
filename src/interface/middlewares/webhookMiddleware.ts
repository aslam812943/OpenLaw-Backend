import { Request, Response, NextFunction } from 'express';
import { IPaymentService } from '../../application/interface/services/IPaymentService';
import { InternalServerError } from '../../infrastructure/errors/InternalServerError';
import { HttpStatusCode } from '../../infrastructure/interface/enums/HttpStatusCode';

export const webhookSignatureVerification = (paymentService: IPaymentService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const signature = req.headers['stripe-signature'] as string;

            if (!signature) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: 'Missing stripe-signature header'
                });
                return;
            }

            const rawBody = req.body instanceof Buffer
                ? req.body
                : Buffer.from('');

            if (rawBody.length === 0) {
                throw new Error('Raw body is required for webhook signature verification');
            }


            const event = await paymentService.verifyWebhookSignature(rawBody, signature);


            req.body = event;

            next();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            next(new InternalServerError(`Webhook verification failed: ${message}`));
        }
    };
};

