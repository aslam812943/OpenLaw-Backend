import { Request, Response, NextFunction } from "express";
import { IGetNotificationsUseCase } from "../../../../application/interface/use-cases/common/notification/IGetNotificationsUseCase";
import { IMarkNotificationAsReadUseCase } from "../../../../application/interface/use-cases/common/notification/IMarkNotificationAsReadUseCase";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../../infrastructure/utils/ApiResponse";

export class NotificationController {
    constructor(
        private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
        private readonly _markAsReadUseCase: IMarkNotificationAsReadUseCase
    ) { }

    async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const notifications = await this._getNotificationsUseCase.execute(userId);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS, notifications);
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { notificationId } = req.params;
            const { userId, all } = req.query;

            await this._markAsReadUseCase.execute({
                notificationId,
                userId: userId as string,
                all: all === "true",
            });

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}
