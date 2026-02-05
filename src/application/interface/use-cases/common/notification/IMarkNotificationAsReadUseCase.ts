export interface IMarkNotificationAsReadUseCase {
    execute(params: { notificationId?: string, userId?: string, all?: boolean }): Promise<void>;
}
