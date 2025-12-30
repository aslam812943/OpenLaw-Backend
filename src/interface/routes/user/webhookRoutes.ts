import { Router } from 'express';
import { WebhookController } from '../../controllers/user/WebhookController';
import { HandleWebhookUseCase } from '../../../application/useCases/user/booking/HandleWebhookUseCase';
import { ConfirmBookingUseCase } from '../../../application/useCases/user/booking/ConfirmBookingUseCase';
import { BookingRepository } from '../../../infrastructure/repositories/user/BookingRepository';
import { AvailabilityRuleRepository } from '../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository';
import { LawyerRepository } from '../../../infrastructure/repositories/lawyer/LawyerRepository';
import { PaymentRepository } from '../../../infrastructure/repositories/PaymentRepository';
import { StripeService } from '../../../infrastructure/services/StripeService';
import { webhookSignatureVerification } from '../../middlewares/webhookMiddleware';

const router = Router();

// Initialize dependencies
const stripeService = new StripeService();
const bookingRepository = new BookingRepository();
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository();
const paymentRepository = new PaymentRepository();

// Initialize use cases
const confirmBookingUseCase = new ConfirmBookingUseCase(
    bookingRepository,
    stripeService,
    availabilityRuleRepository,
    lawyerRepository,
    paymentRepository
);

const handleWebhookUseCase = new HandleWebhookUseCase(confirmBookingUseCase);

// Initialize controller
const webhookController = new WebhookController(handleWebhookUseCase);

router.post(
    '/stripe-webhook',
    webhookSignatureVerification(stripeService),
    (req, res, next) => webhookController.handleWebhook(req, res, next)
);

export default router;

