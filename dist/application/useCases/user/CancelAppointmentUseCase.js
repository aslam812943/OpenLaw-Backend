"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentUseCase = void 0;
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class CancelAppointmentUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(bookingId, reason) {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError_1.NotFoundError("Booking not found");
        }
        await this.bookingRepository.updateStatus(bookingId, "cancelled", reason);
    }
}
exports.CancelAppointmentUseCase = CancelAppointmentUseCase;
//# sourceMappingURL=CancelAppointmentUseCase.js.map