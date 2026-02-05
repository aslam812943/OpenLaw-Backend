import { IMarkNotificationAsReadUseCase } from "../../../interface/use-cases/common/notification/IMarkNotificationAsReadUseCase";
import { INotificationRepository } from "../../../../domain/repositories/INotificationRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(private readonly _notificationRepository: INotificationRepository) { }

    async execute({ notificationId, userId, all }: { notificationId?: string, userId?: string, all?: boolean }): Promise<void> {
        if (all) {
            if (!userId) {
                throw new BadRequestError("User ID is required to mark all notifications as read.");
            }
            await this._notificationRepository.markAllAsRead(userId);
        } else {
            if (!notificationId) {
                throw new BadRequestError("Notification ID is required.");
            }
            await this._notificationRepository.markAsRead(notificationId);
        }
    }
}
