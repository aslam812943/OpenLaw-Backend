import { StripeService } from "../../../infrastructure/services/StripeService";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IVerifySubscriptionPaymentUseCase } from "../../interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";

export class VerifySubscriptionPaymentUseCase implements IVerifySubscriptionPaymentUseCase {
    constructor(
        private stripeService: StripeService,
        private lawyerRepository: ILawyerRepository,
        private paymentRepository: IPaymentRepository,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(sessionId: string): Promise<boolean> {
        const session = await this.stripeService.retrieveSession(sessionId);

        if (session.payment_status === 'paid' && session.metadata?.type === 'subscription') {
            const { lawyerId, subscriptionId } = session.metadata;


            const lawyer = await this.lawyerRepository.findById(lawyerId);
            if (!lawyer) throw new Error("Lawyer not found");


            const existingPayment = await this.paymentRepository.findByTransactionId(session.payment_intent as string);
            if (existingPayment) {

                return true;
            }

            const subscription = await this.subscriptionRepository.findById(subscriptionId);
            if (!subscription) throw new Error("Subscription plan not found");

            let expiryDate = new Date();
            const startDate = new Date();

            if (subscription.durationUnit === 'month') {
                expiryDate.setMonth(expiryDate.getMonth() + subscription.duration);
            } else if (subscription.durationUnit === 'year') {
                expiryDate.setFullYear(expiryDate.getFullYear() + subscription.duration);
            } else {
                // Default to 30 days if unit is unknown, though validation should prevent this
                expiryDate.setDate(expiryDate.getDate() + (subscription.duration * 30));
            }


            await this.paymentRepository.create({
                userId: lawyerId,
                lawyerId: lawyerId,
                bookingId: undefined,
                subscriptionId: subscriptionId,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency || 'inr',
                status: 'completed',
                transactionId: session.payment_intent as string,
                paymentMethod: 'card',
                type: 'subscription'
            });


            await this.lawyerRepository.updateSubscriptionStatus(lawyerId, subscriptionId, true, startDate, expiryDate);

            return true;
        }
        return false;
    }
}
