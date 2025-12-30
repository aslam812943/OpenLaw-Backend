export interface IPaymentService {
    createCheckoutSession(bookingDetails: any): Promise<string>;
    retrieveSession(sessionId: string): Promise<any>;
    verifyWebhookSignature(payload: string | Buffer, signature: string): Promise<any>;
}
