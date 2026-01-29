import { Router } from 'express';
import { webhookController, stripeService } from '../../../di/userContainer';
import { webhookSignatureVerification } from '../../middlewares/webhookMiddleware';

const router = Router();

router.post(
    '/stripe-webhook',
    webhookSignatureVerification(stripeService),
    (req, res, next) => webhookController.handleWebhook(req, res, next)
);

export default router;

