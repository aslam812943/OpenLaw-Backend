import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IPaymentService } from "../../../interface/services/IPaymentService";
import { Booking } from "../../../../domain/entities/Booking";
import { IConfirmBookingUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";
import { IAvailabilityRuleRepository } from '../../../../domain/repositories/lawyer/IAvailabilityRuleRepository'
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";



export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _paymentService: IPaymentService,
        private _slotRepository: IAvailabilityRuleRepository
    ) { }

    async execute(sessionId: string): Promise<ResponseBookingDetilsDTO> {

        const session = await this._paymentService.retrieveSession(sessionId);

        if (session.payment_status !== 'paid') {
            throw new BadRequestError("Payment not completed");
        }

        const metadata = session.metadata;


        if (!metadata) {
            throw new BadRequestError("Invalid session metadata");
        }


        if (!metadata.userId || !metadata.lawyerId || !metadata.date || !metadata.startTime || !metadata.endTime) {
            throw new BadRequestError("Missing required booking details in session metadata");
        }



        const booking = new Booking(
            '',
            metadata.userId,
            metadata.lawyerId,
            metadata.date,
            metadata.startTime,
            metadata.endTime,
            session.amount_total ? session.amount_total / 100 : 0,
            'pending',
            'paid',
            session.payment_intent as string,
            session.id as string,
            metadata.description


        );



        const data = await this._bookingRepository.create(booking);
        await this._slotRepository.bookSlot(metadata.slotId)

        return new ResponseBookingDetilsDTO(data.id, data.date, data.startTime, data.endTime, data.description)


    }
}
