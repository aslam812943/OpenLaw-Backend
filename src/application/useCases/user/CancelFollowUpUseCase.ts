import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ICancelFollowUpUseCase } from "../../interface/use-cases/user/ICancelFollowUpUseCase";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";

export class CancelFollowUpUseCase implements ICancelFollowUpUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _availabilityRuleRepository: IAvailabilityRuleRepository
    ) { }

    async execute(appointmentId: string): Promise<void> {
        const booking = await this._bookingRepository.findById(appointmentId);
        if (!booking) {
            throw new NotFoundError("Appointment not found");
        }

        if (booking.status !== 'follow-up') {
            throw new BadRequestError("This appointment does not have a pending follow-up request");
        }

        if (booking.followUpSlotId) {
            await this._availabilityRuleRepository.releaseSlot(booking.followUpSlotId);
        }

        await this._bookingRepository.updateStatus(appointmentId, 'completed');
        await this._bookingRepository.updateFollowUpStatus(appointmentId, 'cancelled');
    }
}
