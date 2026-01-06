import Stripe from 'stripe';
import { IPaymentService } from '../../application/interface/services/IPaymentService';
import { BookingDTO } from '../../application/dtos/user/BookingDetailsDTO';
import { InternalServerError } from '../errors/InternalServerError';

export class StripeService implements IPaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2025-11-17.clover' as any,
        });
    }

    async createCheckoutSession(bookingDetails: BookingDTO): Promise<string> {
        try {
            const clientUrl = process.env.CLIENT_URL;


            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: `Consultation with ${bookingDetails.lawyerName}`,
                                description: bookingDetails.description,
                            },
                            unit_amount: Math.max(Number(bookingDetails.consultationFee) * 100, 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/cancel`,
                metadata: {
                    userId: bookingDetails.userId,
                    lawyerId: bookingDetails.lawyerId,
                    date: bookingDetails.date,
                    startTime: bookingDetails.startTime,
                    endTime: bookingDetails.endTime,
                    description: bookingDetails.description,
                    slotId: bookingDetails.slotId
                },
            });

            if (!session.url) {
                throw new Error("Failed to create Stripe session URL");
            }
            return session.url;
        } catch (error) {
            console.error("Stripe createCheckoutSession error:", error);
            throw error;
        }
    }
    async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
            console.error("Stripe retrieveSession error:", error);
            throw error;
        }
    }

    async verifyWebhookSignature(
        payload: string | Buffer,
        signature: string
    ): Promise<Stripe.Event> {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!webhookSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
            }

            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            );

            return event;
        } catch (error: any) {

            throw new Error(`Webhook signature verification failed: ${error.message}`);
        }
    }

    async createSubscriptionCheckoutSession(
        lawyerId: string,
        email: string,
        planName: string,
        price: number,
        subscriptionId: string
    ): Promise<string> {
        try {
            const clientUrl = process.env.CLIENT_URL;

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: `Subscription: ${planName}`,
                                description: `Monthly subscription for ${planName} plan`,
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${clientUrl}/lawyer/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/lawyer/dashboard`,
                customer_email: email,
                metadata: {
                    lawyerId,
                    planName,
                    subscriptionId,
                    type: 'subscription'
                },
            });

            if (!session.url) {
                throw new Error("Failed to create Stripe session URL");
            }
            return session.url;
        } catch (error: any) {
        
            throw new InternalServerError(error.message || "Stripe subscription checkout failed");
        }
    }

    async refundPayment(paymentIntentId: string, amount?: number): Promise<void> {
        try {
            await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                ...(amount && { amount: Math.round(amount * 100) })
            });
        } catch (error: any) {
        
            throw new InternalServerError(error.message || "Stripe refund failed");
        }
    }
}
