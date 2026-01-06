import { Request, Response, NextFunction } from "express";
import { ICreateBookingPaymentUseCase } from "../../../application/interface/use-cases/user/IConfirmBookingUseCase";
import { BookingDTO } from "../../../application/dtos/user/BookingDetailsDTO";
import { IConfirmBookingUseCase } from "../../../application/interface/use-cases/user/IConfirmBookingUseCase";
import { IGetUserAppointmentsUseCase } from "../../../application/interface/use-cases/user/IGetUserAppointmentsUseCase";
import { ICancelAppointmentUseCase } from "../../../application/interface/use-cases/user/ICancelAppointmentUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class BookingController {
    constructor(
        private createBookingPaymentUseCase: ICreateBookingPaymentUseCase,
        private confirmBookingUseCase: IConfirmBookingUseCase,
        private getUserAppointmentsUseCase: IGetUserAppointmentsUseCase,
        private cancelAppointmentUseCase: ICancelAppointmentUseCase
    ) { }

    async initiatePayment(req: Request, res: Response, next: NextFunction) {

        try {
            const dto = new BookingDTO(req.body)
            const url = await this.createBookingPaymentUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({ url });
        } catch (error) {
            next(error);
        }
    }

    async confirmBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                throw new Error("Session ID is required");
            }
            const booking = await this.confirmBookingUseCase.execute(sessionId);
            res.status(HttpStatusCode.CREATED).json({ success: true, booking });
        } catch (error) {

            next(error);
        }
    }

    async getAppointments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const result = await this.getUserAppointmentsUseCase.execute(userId, page, limit);

            res.status(HttpStatusCode.OK).json({
                appointments: result.appointments,
                pagination: {
                    currentPage: page,
                    totalItems: result.total,
                    totalPages: Math.ceil(result.total / limit),
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelAppointment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                throw new Error("Cancellation reason is required");
            }
            await this.cancelAppointmentUseCase.execute(id, reason);
            res.status(HttpStatusCode.OK).json({ success: true, message: "Appointment cancelled successfully" });
        } catch (error) {
            next(error);
        }
    }
}
