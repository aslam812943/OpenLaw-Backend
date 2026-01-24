import { IPaymentService } from "../../interface/services/IPaymentService";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IVerifySubscriptionPaymentUseCase } from "../../interface/use-cases/lawyer/IVerifySubscriptionPaymentUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";

export class VerifySubscriptionPaymentUseCase implements IVerifySubscriptionPaymentUseCase {
    constructor(
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(sessionId: string): Promise<boolean> {
        const session = await this._paymentService.retrieveSession(sessionId);

        if (session.payment_status === 'paid' && session.metadata?.type === 'subscription') {
            const { lawyerId, subscriptionId } = session.metadata;


            const lawyer = await this._lawyerRepository.findById(lawyerId);
            if (!lawyer) throw new Error("Lawyer not found");


            const existingPayment = await this._paymentRepository.findByTransactionId(session.payment_intent as string);
            if (existingPayment) {

                return true;
            }

            const subscription = await this._subscriptionRepository.findById(subscriptionId);
            if (!subscription) throw new Error("Subscription plan not found");

            let expiryDate = new Date();
            const startDate = new Date();

            if (subscription.durationUnit === 'month') {
                expiryDate.setMonth(expiryDate.getMonth() + subscription.duration);
            } else if (subscription.durationUnit === 'year') {
                expiryDate.setFullYear(expiryDate.getFullYear() + subscription.duration);
            } else {

                expiryDate.setDate(expiryDate.getDate() + (subscription.duration * 30));
            }


            await this._paymentRepository.create({
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


            await this._lawyerRepository.updateSubscriptionStatus(lawyerId, subscriptionId, true, startDate, expiryDate);

            return true;
        }
        return false;
    }
}
