"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const BookingDetailsDTO_1 = require("../../../application/dtos/user/BookingDetailsDTO");
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class BookingController {
    constructor(createBookingPaymentUseCase, confirmBookingUseCase, getUserAppointmentsUseCase, cancelAppointmentUseCase) {
        this.createBookingPaymentUseCase = createBookingPaymentUseCase;
        this.confirmBookingUseCase = confirmBookingUseCase;
        this.getUserAppointmentsUseCase = getUserAppointmentsUseCase;
        this.cancelAppointmentUseCase = cancelAppointmentUseCase;
    }
    async initiatePayment(req, res, next) {
        try {
            const dto = new BookingDetailsDTO_1.BookingDTO(req.body);
            const url = await this.createBookingPaymentUseCase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ url });
        }
        catch (error) {
            next(error);
        }
    }
    async confirmBooking(req, res, next) {
        try {
            const { sessionId } = req.body;
            if (!sessionId) {
                throw new Error("Session ID is required");
            }
            const booking = await this.confirmBookingUseCase.execute(sessionId);
            res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({ success: true, booking });
        }
        catch (error) {
            next(error);
        }
    }
    async getAppointments(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const appointments = await this.getUserAppointmentsUseCase.execute(userId);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json(appointments);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelAppointment(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            if (!reason) {
                throw new Error("Cancellation reason is required");
            }
            await this.cancelAppointmentUseCase.execute(id, reason);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: "Appointment cancelled successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=BookingController.js.map