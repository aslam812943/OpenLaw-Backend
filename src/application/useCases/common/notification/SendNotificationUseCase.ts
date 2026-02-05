import { ISendNotificationUseCase } from "../../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { INotificationRepository } from "../../../../domain/repositories/INotificationRepository";
import { ISocketServer } from "../../../interface/services/ISocketServer";

export class SendNotificationUseCase implements ISendNotificationUseCase {
    constructor(
        private readonly _notificationRepository: INotificationRepository,
        private readonly _socketServer: ISocketServer
    ) { }

    async execute(userId: string, message: string, type: string, metadata?: Record<string, any>): Promise<void> {
        const notification = await this._notificationRepository.save({
            userId,
            message,
            type,
            isRead: false,
            metadata
        });

        this._socketServer.sendNotification(userId, JSON.stringify({
            id: notification.id,
            message: notification.message,
            type: notification.type,
            createdAt: notification.createdAt,
            isRead: notification.isRead,
            metadata: notification.metadata
        }));
    }
}
