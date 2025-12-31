import { IHandleWebhookUseCase } from '../../../interface/use-cases/user/IHandleWebhookUseCase';
import { IConfirmBookingUseCase } from '../../../interface/use-cases/user/IConfirmBookingUseCase';
import { StripeWebhookEventType } from '../../../../infrastructure/interface/enums/StripeWebhookEvent';
import { BadRequestError } from '../../../../infrastructure/errors/BadRequestError';


export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        private confirmBookingUseCase: IConfirmBookingUseCase
    ) {}

    async execute(event: any): Promise<void> {
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
                console.log(`Unhandled event type: ${eventType}`);
        }
    }

    
    private async handleCheckoutSessionCompleted(event: any): Promise<void> {
        const session = event.data.object;

        
        if (session.payment_status !== 'paid') {
            console.log(`Payment not completed for session ${session.id}, status: ${session.payment_status}`);
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
          
            await this.confirmBookingUseCase.execute(session.id);
         
        } catch (error) {
            
            throw error;
        }
    }
}


