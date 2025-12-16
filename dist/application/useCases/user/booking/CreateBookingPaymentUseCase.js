"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingPaymentUseCase = void 0;
class CreateBookingPaymentUseCase {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async execute(bookingDetails) {
        // Create a checkout session for the booking
        return await this.paymentService.createCheckoutSession(bookingDetails);
    }
}
exports.CreateBookingPaymentUseCase = CreateBookingPaymentUseCase;
//# sourceMappingURL=CreateBookingPaymentUseCase.js.map