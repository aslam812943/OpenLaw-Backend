import { IPaymentService } from "../../../interface/services/IPaymentService";
import { ICreateBookingPaymentUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";

export class CreateBookingPaymentUseCase implements ICreateBookingPaymentUseCase {
    constructor(private paymentService: IPaymentService) { }

    async execute(bookingDetails: BookingDTO): Promise<string> {

        return await this.paymentService.createCheckoutSession(bookingDetails);
    }
}
