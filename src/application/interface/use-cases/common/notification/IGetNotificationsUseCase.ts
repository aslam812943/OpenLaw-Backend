import { ResponseNotificationDTO } from "../../../../dtos/common/ResponseNotificationDTO";

export interface IGetNotificationsUseCase {
    execute(userId: string): Promise<ResponseNotificationDTO[]>;
}
