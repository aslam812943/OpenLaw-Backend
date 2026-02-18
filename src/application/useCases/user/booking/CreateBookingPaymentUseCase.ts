import { IPaymentService } from "../../../interface/services/IPaymentService";
import { ICreateBookingPaymentUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { ILawyerRepository } from "../../../../domain/repositories/lawyer/ILawyerRepository";
import { IAvailabilityRuleRepository } from "../../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { MessageConstants } from "../../../../infrastructure/constants/MessageConstants";

export class CreateBookingPaymentUseCase implements ICreateBookingPaymentUseCase {
    constructor(
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _slotRepository: IAvailabilityRuleRepository
    ) { }

    async execute(bookingDetails: BookingDTO): Promise<string> {
        if (bookingDetails.slotId) {
            const slot = await this._slotRepository.getSlotById(bookingDetails.slotId);
            if (slot && slot.restrictedTo && slot.restrictedTo !== bookingDetails.userId) {
                throw new BadRequestError("This slot is reserved for a specific follow-up appointment.");
            }

            const reserved = await this._slotRepository.reserveSlot(bookingDetails.slotId, bookingDetails.userId);
            if (!reserved) {
                throw new BadRequestError(MessageConstants.BOOKING.SLOT_ALREADY_TAKEN);
            }
        }

        const lawyer = await this._lawyerRepository.findById(bookingDetails.lawyerId);
        if (!lawyer || lawyer.consultationFee === undefined) {
            throw new BadRequestError("Lawyer profile or consultation fee not found.");
        }

        bookingDetails.consultationFee = lawyer.consultationFee;

        return await this._paymentService.createCheckoutSession(bookingDetails);
    }
}
