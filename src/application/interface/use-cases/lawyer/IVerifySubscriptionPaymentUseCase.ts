export interface IVerifySubscriptionPaymentUseCase {
    execute(sessionId: string): Promise<boolean>;
}
