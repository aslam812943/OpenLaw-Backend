import Stripe from 'stripe';
import { BookingDTO } from '../../dtos/user/BookingDetailsDTO';

export interface IPaymentService {
    createCheckoutSession(bookingDetails: BookingDTO): Promise<string>;
    createSubscriptionCheckoutSession(
        lawyerId: string,
        email: string,
        planName: string,
        price: number,
        subscriptionId: string
    ): Promise<string>;
    retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    verifyWebhookSignature(payload: string | Buffer, signature: string): Promise<Stripe.Event>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<void>;
}
