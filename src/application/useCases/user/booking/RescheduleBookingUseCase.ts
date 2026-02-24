import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ISendNotificationUseCase } from "../../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IRescheduleBookingUseCase } from "../../../interface/use-cases/user/IRescheduleBookingUseCase";
import { RescheduleBookingDTO } from "../../../dtos/user/RescheduleBookingDTO";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { MessageConstants } from "../../../../infrastructure/constants/MessageConstants";

export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _slotRepository: IAvailabilityRuleRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(userId: string, dto: RescheduleBookingDTO): Promise<void> {
        const { bookingId, newSlotId } = dto;

        const booking = await this._bookingRepository.findById(bookingId);

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.userId.toString() !== userId) {
            throw new BadRequestError("You are not authorized to reschedule this booking.");
        }

        if (booking.status !== 'confirmed') {
            throw new BadRequestError(`Only confirmed appointments can be rescheduled. Current status: ${booking.status}`);
        }

        if (booking.rescheduleCount >= 1) {
            throw new BadRequestError("This appointment has already been rescheduled once. You can only reschedule an appointment one time.");
        }


        const now = new Date();
        const appointmentTime = new Date(`${booking.date}T${booking.startTime}`);
        const diffInHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            throw new BadRequestError(MessageConstants.BOOKING.RESCHEDULE_WINDOW_EXPIRED);
        }

        const newSlot = await this._slotRepository.getSlotById(newSlotId);

        if (!newSlot) {
            throw new NotFoundError("New slot not found");
        }

        if (newSlot.userId.toString() !== booking.lawyerId.toString()) {
            throw new BadRequestError("The new slot does not belong to the same lawyer.");
        }

        if (newSlot.isBooked) {
            throw new BadRequestError(MessageConstants.BOOKING.SLOT_ALREADY_TAKEN);
        }


        await this._slotRepository.releaseSlotByBookingId(bookingId);

        await this._slotRepository.bookSlot(newSlotId, userId, bookingId);

        await this._bookingRepository.rescheduleBooking(
            bookingId,
            newSlot.date,
            newSlot.startTime,
            newSlot.endTime,
            newSlotId
        );


        // Notify Lawyer
        await this._sendNotificationUseCase.execute(
            booking.lawyerId.toString(),
            `Appointment ${booking.bookingId} has been rescheduled to ${newSlot.date} at ${newSlot.startTime}.`,
            'BOOKING_RESCHEDULED',
            { bookingId }
        );
    }
}
