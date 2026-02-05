export interface ResponseNotificationDTO {
    id: string;
    userId: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, unknown>;
}
