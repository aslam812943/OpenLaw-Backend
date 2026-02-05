import { Notification } from "../../../domain/entities/Notification";
import { ResponseNotificationDTO } from "../../dtos/common/ResponseNotificationDTO";

export class NotificationMapper {
    static toDTO(notification: Notification): ResponseNotificationDTO {
        return {
            id: notification.id,
            userId: notification.userId,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.createdAt.toISOString(),
            metadata: notification.metadata
        };
    }

    static toDTOs(notifications: Notification[]): ResponseNotificationDTO[] {
        return notifications.map(notification => this.toDTO(notification));
    }
}
