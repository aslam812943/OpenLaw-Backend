import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ISetFollowUpUseCase } from "../../interface/use-cases/lawyer/ISetFollowUpUseCase";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";

export class SetFollowUpUseCase implements ISetFollowUpUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _availabilityRuleRepository: IAvailabilityRuleRepository,
        private _lawyerRepository: ILawyerRepository
    ) { }

    private getAppointmentEndDateTime(date: string, endTime: string): Date {
        const endDateTime = new Date(date);

        
        if (endTime.includes(' ')) {
            const [time, modifier] = endTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            endDateTime.setHours(hours, minutes, 0, 0);
        } else {
            const [hours, minutes] = endTime.split(':').map(Number);
            endDateTime.setHours(hours, minutes, 0, 0);
        }

        return endDateTime;
    }

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

        const appointmentEndDateTime = this.getAppointmentEndDateTime(booking.date, booking.endTime);
        const now = new Date();
        if (appointmentEndDateTime > now) {
            throw new BadRequestError("Follow-up can only be added after the booked time has finished.");
        }


        if (followUpType === 'specific' && (!followUpDate || !followUpTime)) {
            throw new BadRequestError("Date and time are required for specific follow-up.");
        }

        if (followUpType === 'deadline' && !followUpDate) {
            throw new BadRequestError("Deadline date is required.");
        }

        let followUpSlotId: string | undefined;
        if (followUpType === 'specific') {
            const slotId = await this._availabilityRuleRepository.findSlotIdByDateTime(booking.lawyerId, followUpDate!, followUpTime!);
            if (!slotId) {
                throw new BadRequestError("The requested follow-up slot does not exist.");
            }

            await this._availabilityRuleRepository.restrictSlot(slotId, booking.userId);
            followUpSlotId = slotId;
        }

        await this._bookingRepository.setFollowUpDetails(appointmentId, followUpType, followUpDate, followUpTime, feedback, followUpSlotId);

        const commissionPercent = booking.commissionPercent || 0;
        const commissionAmount = booking.consultationFee * (commissionPercent / 100);
        const netAmount = booking.consultationFee - commissionAmount;

        await this._lawyerRepository.updateWalletBalance(booking.lawyerId, netAmount);

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
