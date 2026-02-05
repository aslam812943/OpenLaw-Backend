import { IGetNotificationsUseCase } from "../../../interface/use-cases/common/notification/IGetNotificationsUseCase";
import { INotificationRepository } from "../../../../domain/repositories/INotificationRepository";
import { ResponseNotificationDTO } from "../../../dtos/common/ResponseNotificationDTO";
import { NotificationMapper } from "../../../mapper/common/NotificationMapper";

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
    constructor(private readonly _notificationRepository: INotificationRepository) { }

    async execute(userId: string): Promise<ResponseNotificationDTO[]> {
        const notifications = await this._notificationRepository.getNotificationsByUserId(userId);
        return NotificationMapper.toDTOs(notifications);
    }
}
