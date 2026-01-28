import Stripe from 'stripe';
import { IHandleWebhookUseCase } from '../../../interface/use-cases/user/IHandleWebhookUseCase';
import { IConfirmBookingUseCase } from '../../../interface/use-cases/user/IConfirmBookingUseCase';
import { StripeWebhookEventType } from '../../../../infrastructure/interface/enums/StripeWebhookEvent';
import { BadRequestError } from '../../../../infrastructure/errors/BadRequestError';
import logger from '../../../../infrastructure/logging/logger';

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        private _confirmBookingUseCase: IConfirmBookingUseCase
    ) { }

    async execute(event: Stripe.Event): Promise<void> {
        const eventType = event.type;

        switch (eventType) {
            case StripeWebhookEventType.CHECKOUT_SESSION_COMPLETED:
                await this.handleCheckoutSessionCompleted(event);
                break;

            case StripeWebhookEventType.PAYMENT_INTENT_SUCCEEDED:

                break;

            case StripeWebhookEventType.PAYMENT_INTENT_PAYMENT_FAILED:

                break;

            default:
                logger.info('Unhandled event type',{event:eventType})

        }
    }


    private async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
        const session = event.data.object as Stripe.Checkout.Session;


        if (session.payment_status !== 'paid') {
            return;
        }

        if (!session.metadata) {
            throw new BadRequestError('Invalid session metadata in webhook event');
        }


        const { userId, lawyerId, date, startTime, endTime, slotId } = session.metadata;
        if (!userId || !lawyerId || !date || !startTime || !endTime || !slotId) {
            throw new BadRequestError('Missing required booking details in session metadata');
        }

        try {

            await this._confirmBookingUseCase.execute(session.id);

        } catch (error) {

            throw error;
        }
    }
}


