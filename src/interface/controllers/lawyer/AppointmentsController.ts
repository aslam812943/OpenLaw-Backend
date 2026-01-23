import { Request, Response, NextFunction } from "express";
import { IGetAppoimentsUseCase } from "../../../application/interface/use-cases/lawyer/IGetAppoimentsUseCase";
import { IUpdateAppointmentStatusUseCase } from "../../../application/interface/use-cases/lawyer/IUpdateAppointmentStatusUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class AppointmentsController {
    constructor(
        private readonly _getAppointmentsUseCase: IGetAppoimentsUseCase,
        private readonly _updateStatusUseCase: IUpdateAppointmentStatusUseCase
    ) { }

    async getAppointments(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            const search = req.query.search as string;
            const date = req.query.date as string;

            const result = await this._getAppointmentsUseCase.execute(lawyerId!, { page, limit, status, search, date });

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.APPOINTMENTS_FETCH_SUCCESS,
                data: {
                    appointments: result.appointments,
                    total: result.total
                }
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status, feedback } = req.body;

            await this._updateStatusUseCase.execute(id, status, feedback);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.COMMON.SUCCESS
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
