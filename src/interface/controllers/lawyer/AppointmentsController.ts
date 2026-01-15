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
            const data = await this._getAppointmentsUseCase.execute(lawyerId!);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.APPOINTMENTS_FETCH_SUCCESS,
                data
            });
        } catch (error) {
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
        } catch (error) {
            next(error);
        }
    }
}
