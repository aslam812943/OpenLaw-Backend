import { StripeService } from "../../../infrastructure/services/StripeService";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IVerifySubscriptionPaymentUseCase } from "../../interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";

export class VerifySubscriptionPaymentUseCase implements IVerifySubscriptionPaymentUseCase {
    constructor(
        private stripeService: StripeService,
        private lawyerRepository: ILawyerRepository,
        private paymentRepository: IPaymentRepository
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


            await this.lawyerRepository.updateSubscriptionStatus(lawyerId, subscriptionId, true);

            return true;
        }
        return false;
    }
}
