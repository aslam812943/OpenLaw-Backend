import { Request, Response, NextFunction } from 'express';
import { IPaymentService } from '../../application/interface/services/IPaymentService';
import { InternalServerError } from '../../infrastructure/errors/InternalServerError';


export const webhookSignatureVerification = (paymentService: IPaymentService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const signature = req.headers['stripe-signature'] as string;

            if (!signature) {
                res.status(400).json({
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
        } catch (error: any) {
            
            next(new InternalServerError(`Webhook verification failed: ${error.message}`));
        }
    };
};

