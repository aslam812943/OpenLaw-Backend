import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { NotificationModel } from "../db/models/NotificationModel";

export class NotificationRepository implements INotificationRepository {
    async save(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
        const created = await NotificationModel.create(notification);
        return new Notification(
            created.id,
            created.userId,
            created.message,
            created.type,
            created.isRead,
            created.createdAt
        );
    }

    async getNotificationsByUserId(userId: string): Promise<Notification[]> {
        const list = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
        return list.map(
            (doc) =>
                new Notification(
                    doc.id,
                    doc.userId,
                    doc.message,
                    doc.type,
                    doc.isRead,
                    doc.createdAt
                )
        );
    }

    async markAsRead(notificationId: string): Promise<void> {
        await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    }

    async delete(notificationId: string): Promise<void> {
        await NotificationModel.findByIdAndDelete(notificationId);
    }
}
