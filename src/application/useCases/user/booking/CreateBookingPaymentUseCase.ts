import { IPaymentService } from "../../../interface/services/IPaymentService";
import { ICreateBookingPaymentUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";

export class CreateBookingPaymentUseCase implements ICreateBookingPaymentUseCase {
    constructor(
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository
    ) { }

    async execute(bookingDetails: BookingDTO): Promise<string> {
        const lawyer = await this._lawyerRepository.findById(bookingDetails.lawyerId);
        if (!lawyer || lawyer.consultationFee === undefined) {
            throw new BadRequestError("Lawyer profile or consultation fee not found.");
        }

        bookingDetails.consultationFee = lawyer.consultationFee;

        return await this._paymentService.createCheckoutSession(bookingDetails);
    }
}
