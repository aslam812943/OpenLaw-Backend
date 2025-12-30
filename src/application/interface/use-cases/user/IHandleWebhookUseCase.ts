
export interface IHandleWebhookUseCase {
    execute(event: any): Promise<void>;
}

