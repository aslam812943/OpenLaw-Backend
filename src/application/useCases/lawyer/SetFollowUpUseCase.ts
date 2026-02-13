import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ISetFollowUpUseCase } from "../../interface/use-cases/lawyer/ISetFollowUpUseCase";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";

export class SetFollowUpUseCase implements ISetFollowUpUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(appointmentId: string, followUpType: 'none' | 'specific' | 'deadline', followUpDate?: string, followUpTime?: string, feedback?: string): Promise<void> {
        if (!appointmentId || !followUpType) {
            throw new BadRequestError("Appointment ID and follow-up type are required.");
        }

        const booking = await this._bookingRepository.findById(appointmentId);
        if (!booking) {
            throw new NotFoundError("Appointment not found.");
        }

        if (booking.status === 'cancelled' || booking.status === 'rejected') {
            throw new BadRequestError("Follow-up cannot be set for cancelled or rejected appointments.");
        }


        if (followUpType === 'specific' && (!followUpDate || !followUpTime)) {
            throw new BadRequestError("Date and time are required for specific follow-up.");
        }

        if (followUpType === 'deadline' && !followUpDate) {
            throw new BadRequestError("Deadline date is required.");
        }

        await this._bookingRepository.setFollowUpDetails(appointmentId, followUpType, followUpDate, followUpTime, feedback);

        // Notify User
        let message = "";
        if (followUpType === 'specific') {
            message = `Your lawyer has suggested a follow-up consultation on ${followUpDate} at ${followUpTime}. You can book it now!`;
        } else if (followUpType === 'deadline') {
            message = `Your lawyer has opened follow-up slots until ${followUpDate}. You can pick any available slot and book now!`;
        }

        if (message) {
            await this._sendNotificationUseCase.execute(
                booking.userId,
                message,
                'FOLLOW_UP_AVAILABLE',
                { appointmentId }
            );
        }
    }
}
