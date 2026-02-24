import { Request, Response, NextFunction } from "express";
import { IGetAppoimentsUseCase } from "../../../application/interface/use-cases/lawyer/IGetAppoimentsUseCase";
import { IUpdateAppointmentStatusUseCase } from "../../../application/interface/use-cases/lawyer/IUpdateAppointmentStatusUseCase";
import { ISetFollowUpUseCase } from "../../../application/interface/use-cases/lawyer/ISetFollowUpUseCase";
import { IGetAppointmentDetailsUseCase } from "../../../application/interface/use-cases/lawyer/IGetAppointmentDetailsUseCase";
import { ILawyerRescheduleBookingUseCase } from "../../../application/interface/use-cases/lawyer/ILawyerRescheduleBookingUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class AppointmentsController {
    constructor(
        private readonly _getAppointmentsUseCase: IGetAppoimentsUseCase,
        private readonly _updateStatusUseCase: IUpdateAppointmentStatusUseCase,
        private readonly _setFollowUpUseCase: ISetFollowUpUseCase,
        private readonly _getAppointmentDetailsUseCase: IGetAppointmentDetailsUseCase,
        private readonly _rescheduleUseCase: ILawyerRescheduleBookingUseCase
    ) { }

    async getAppointments(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            const search = req.query.search as string;
            const date = req.query.date as string;

            const result = await this._getAppointmentsUseCase.execute(lawyerId!, { page, limit, status, search, date });

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.APPOINTMENTS_FETCH_SUCCESS, {
                appointments: result.appointments,
                total: result.total
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async getAppointmentDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const result = await this._getAppointmentDetailsUseCase.execute(id);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.APPOINTMENTS_FETCH_SUCCESS, result);
        } catch (error: unknown) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { status, feedback } = req.body;

            await this._updateStatusUseCase.execute(id, status, feedback);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS);
        } catch (error: unknown) {
            next(error);
        }
    }

    async setFollowUp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { followUpType, followUpDate, followUpTime, feedback } = req.body;

            await this._setFollowUpUseCase.execute(id, followUpType, followUpDate, followUpTime, feedback);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS);
        } catch (error: unknown) {
            next(error);
        }
    }

    async reschedule(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
            }
            const { id } = req.params;
            const { newSlotId } = req.body;

            if (!newSlotId) {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
            }

            await this._rescheduleUseCase.execute(lawyerId, { bookingId: id, newSlotId });

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.BOOKING.RESCHEDULE_SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}
