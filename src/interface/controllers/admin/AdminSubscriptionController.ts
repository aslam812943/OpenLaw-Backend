import { Request, Response, NextFunction } from 'express';
import { ICreateSubscriptionUseCase } from '../../../application/interface/use-cases/admin/ICreateSubscriptionUseCase';
import { IGetSubscriptionsUseCase } from '../../../application/interface/use-cases/admin/IGetSubscriptionsUseCase';
import { IToggleSubscriptionStatusUseCase } from '../../../application/interface/use-cases/admin/IToggleSubscriptionStatusUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';
import { CreateSubscriptionDTO } from '../../../application/dtos/admin/CreateSubscriptionDTO';
import { MessageConstants } from '../../../infrastructure/constants/MessageConstants';

export class AdminSubscriptionController {
    constructor(
        private readonly _createSubscriptionUseCase: ICreateSubscriptionUseCase,
        private readonly _getSubscriptionsUseCase: IGetSubscriptionsUseCase,
        private readonly _toggleSubscriptionStatusUseCase: IToggleSubscriptionStatusUseCase
    ) { }

    async createSubscription(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = new CreateSubscriptionDTO(req.body.planName, Number(req.body.duration), req.body.durationUnit, Number(req.body.price), Number(req.body.commissionPercent))
            await this._createSubscriptionUseCase.execute(dto);

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.CREATE_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllSubscriptions(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this._getSubscriptionsUseCase.execute(page, limit);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.FETCH_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleSubscriptionStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await this._toggleSubscriptionStatusUseCase.execute(id, status);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.SUBSCRIPTION.STATUS_UPDATE_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
}
