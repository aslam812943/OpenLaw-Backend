export interface IPaymentService {
    createCheckoutSession(bookingDetails: any): Promise<string>;
    retrieveSession(sessionId: string): Promise<any>;
}
