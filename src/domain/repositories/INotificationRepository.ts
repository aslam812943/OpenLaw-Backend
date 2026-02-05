import { Notification } from "../entities/Notification";

export interface INotificationRepository {
    save(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
    getNotificationsByUserId(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    delete(notificationId: string): Promise<void>;
}
