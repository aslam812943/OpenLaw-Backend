export interface ISendNotificationUseCase {
    execute(userId: string, message: string, type: string, metadata?: Record<string, unknown>): Promise<void>;
}
