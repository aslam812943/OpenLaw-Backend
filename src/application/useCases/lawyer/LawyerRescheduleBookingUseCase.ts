import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { ILawyerRescheduleBookingUseCase, LawyerRescheduleDTO } from "../../interface/use-cases/lawyer/ILawyerRescheduleBookingUseCase";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class LawyerRescheduleBookingUseCase implements ILawyerRescheduleBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _slotRepository: IAvailabilityRuleRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(lawyerId: string, data: LawyerRescheduleDTO): Promise<void> {
        const { bookingId, newSlotId } = data;

        const booking = await this._bookingRepository.findById(bookingId);

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.lawyerId.toString() !== lawyerId) {
            throw new BadRequestError("You are not authorized to reschedule this booking.");
        }

        if (booking.status !== 'confirmed') {
            throw new BadRequestError(`Only confirmed appointments can be rescheduled. Current status: ${booking.status}`);
        }

        if (booking.rescheduleCount >= 1) {
            throw new BadRequestError("This appointment has already been rescheduled once. You can only reschedule an appointment one time.");
        }

        const newSlot = await this._slotRepository.getSlotById(newSlotId);

        if (!newSlot) {
            throw new NotFoundError("New slot not found");
        }

        if (newSlot.userId.toString() !== lawyerId) {
            throw new BadRequestError("The new slot does not belong to you.");
        }

        if (newSlot.isBooked) {
            throw new BadRequestError(MessageConstants.BOOKING.SLOT_ALREADY_TAKEN);
        }

        await this._slotRepository.releaseSlotByBookingId(
            bookingId,
            booking.lawyerId.toString(),
            booking.date,
            booking.startTime
        );

        await this._slotRepository.bookSlot(newSlotId, booking.userId.toString(), bookingId);

        await this._bookingRepository.rescheduleBooking(
            bookingId,
            newSlot.date,
            newSlot.startTime,
            newSlot.endTime,
            newSlotId
        );

        // 4. Notify the user about the change
        await this._sendNotificationUseCase.execute(
            booking.userId.toString(),
            `Your appointment with your lawyer has been rescheduled by the lawyer to ${newSlot.date} at ${newSlot.startTime}.`,
            'BOOKING_RESCHEDULED',
            { bookingId }
        );
    }
}
