"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmBookingUseCase = void 0;
const Booking_1 = require("../../../../domain/entities/Booking");
const ResponseBookingDetilsDTO_1 = require("../../../dtos/user/ResponseBookingDetilsDTO");
const BadRequestError_1 = require("../../../../infrastructure/errors/BadRequestError");
class ConfirmBookingUseCase {
    constructor(_bookingRepository, _paymentService, _slotRepository) {
        this._bookingRepository = _bookingRepository;
        this._paymentService = _paymentService;
        this._slotRepository = _slotRepository;
    }
    async execute(sessionId) {
        const session = await this._paymentService.retrieveSession(sessionId);
        if (session.payment_status !== 'paid') {
            throw new BadRequestError_1.BadRequestError("Payment not completed");
        }
        const metadata = session.metadata;
        if (!metadata) {
            throw new BadRequestError_1.BadRequestError("Invalid session metadata");
        }
        if (!metadata.userId || !metadata.lawyerId || !metadata.date || !metadata.startTime || !metadata.endTime) {
            throw new BadRequestError_1.BadRequestError("Missing required booking details in session metadata");
        }
        const booking = new Booking_1.Booking('', metadata.userId, metadata.lawyerId, metadata.date, metadata.startTime, metadata.endTime, session.amount_total ? session.amount_total / 100 : 0, 'pending', 'paid', session.payment_intent, session.id, metadata.description);
        const data = await this._bookingRepository.create(booking);
        await this._slotRepository.bookSlot(metadata.slotId);
        return new ResponseBookingDetilsDTO_1.ResponseBookingDetilsDTO(data.id, data.date, data.startTime, data.endTime, data.description);
    }
}
exports.ConfirmBookingUseCase = ConfirmBookingUseCase;
//# sourceMappingURL=ConfirmBookingUseCase.js.map