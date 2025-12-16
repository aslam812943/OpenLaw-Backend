import Stripe from 'stripe';
import { IPaymentService } from '../../application/interface/services/IPaymentService';

export class StripeService implements IPaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2025-11-17.clover' as any,
        });
    }

    async createCheckoutSession(bookingDetails: any): Promise<string> {
        try {
            const clientUrl = process.env.CLIENT_URL ;
   

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: `Consultation with ${bookingDetails.lawyerName}`,
                                description: bookingDetails.description ,
                            },
                            unit_amount: Math.max(bookingDetails.consultationFee * 100, 100), 
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
                    description:bookingDetails.description,
                    slotId:bookingDetails.slotId
                },
            });

            return session.url as string;
        } catch (error) {
           
            throw error;
        }
    }
    async retrieveSession(sessionId: string): Promise<any> {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
           
            throw error;
        }
    }
}
