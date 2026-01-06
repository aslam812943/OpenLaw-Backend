import { IPaymentService } from "../../../interface/services/IPaymentService";
import { ICreateBookingPaymentUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
export class CreateBookingPaymentUseCase implements ICreateBookingPaymentUseCase {
    constructor(private paymentService: IPaymentService) { }

    async execute(bookingDetails: any): Promise<string> {
  
        return await this.paymentService.createCheckoutSession(bookingDetails);
    }
}
