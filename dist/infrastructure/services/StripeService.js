"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-11-17.clover',
        });
    }
    async createCheckoutSession(bookingDetails) {
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
                    description: bookingDetails.description,
                    slotId: bookingDetails.slotId
                },
            });
            return session.url;
        }
        catch (error) {
            throw error;
        }
    }
    async retrieveSession(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.StripeService = StripeService;
//# sourceMappingURL=StripeService.js.map