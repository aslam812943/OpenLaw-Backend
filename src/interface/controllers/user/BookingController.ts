import { Request, Response, NextFunction } from "express";
import { ICreateBookingPaymentUseCase } from "../../../application/interface/use-cases/user/IConfirmBookingUseCase";
import { BookingDTO } from "../../../application/dtos/user/BookingDetailsDTO";
import { IConfirmBookingUseCase } from "../../../application/interface/use-cases/user/IConfirmBookingUseCase";
import { IGetUserAppointmentsUseCase } from "../../../application/interface/use-cases/user/IGetUserAppointmentsUseCase";
import { ICancelAppointmentUseCase } from "../../../application/interface/use-cases/user/ICancelAppointmentUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class BookingController {
    constructor(
        private readonly _createBookingPaymentUseCase: ICreateBookingPaymentUseCase,
        private readonly _confirmBookingUseCase: IConfirmBookingUseCase,
        private readonly _getUserAppointmentsUseCase: IGetUserAppointmentsUseCase,
        private readonly _cancelAppointmentUseCase: ICancelAppointmentUseCase
    ) { }

    async initiatePayment(req: Request, res: Response, next: NextFunction) {
        try {
            const bookingDto = new BookingDTO(req.body);
            const url = await this._createBookingPaymentUseCase.execute(bookingDto);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.BOOKING.INITIATE_SUCCESS, { url });
        } catch (error) {
            next(error);
        }
    }

    async confirmBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
            }
            const booking = await this._confirmBookingUseCase.execute(sessionId);

            return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.BOOKING.CONFIRM_SUCCESS, booking);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getAppointments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const status = req.query.status as string;
            const search = req.query.search as string;
            const date = req.query.date as string;

            const result = await this._getUserAppointmentsUseCase.execute(userId, { page, limit, status, search, date });

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.BOOKING.FETCH_SUCCESS, {
                appointments: result.appointments,
                total: result.total
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    async cancelAppointment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
            }
            await this._cancelAppointmentUseCase.execute(id, reason);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.BOOKING.CANCEL_SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}
