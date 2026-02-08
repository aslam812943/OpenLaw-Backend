import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { NotificationModel } from "../db/models/NotificationModel";

import { BaseRepository } from "./BaseRepository";
import { INotificationDocument } from "../db/models/NotificationModel";
import { MessageConstants } from "../constants/MessageConstants";
import { InternalServerError } from "../errors/InternalServerError";

export class NotificationRepository extends BaseRepository<INotificationDocument> implements INotificationRepository {
    constructor() {
        super(NotificationModel);
    }
    async save(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
        try {
            const created = await NotificationModel.create(notification);
            return new Notification(
                created.id,
                created.userId,
                created.message,
                created.type,
                created.isRead,
                created.createdAt
            );
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async getNotificationsByUserId(userId: string): Promise<Notification[]> {
        try {
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
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async markAsRead(notificationId: string): Promise<void> {
        try {
            await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        try {
            await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async delete(notificationId: string): Promise<void> {
        try {
            await NotificationModel.findByIdAndDelete(notificationId);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.DELETE_ERROR);
        }
    }
}
