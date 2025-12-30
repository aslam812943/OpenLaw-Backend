import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IPaymentRepository } from "../../../../domain/repositories/IPaymentRepository";
import { IPaymentService } from "../../../interface/services/IPaymentService";
import { Booking } from "../../../../domain/entities/Booking";
import { Payment } from "../../../../domain/entities/Payment";
import { IConfirmBookingUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";
import { IAvailabilityRuleRepository } from '../../../../domain/repositories/lawyer/IAvailabilityRuleRepository';
import { ILawyerRepository } from '../../../../domain/repositories/lawyer/ILawyerRepository';
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";


export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _paymentService: IPaymentService,
        private _slotRepository: IAvailabilityRuleRepository,
        private _lawyerRepository: ILawyerRepository,
        private _paymentRepository: IPaymentRepository
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

        
        const lawyer = await this._lawyerRepository.findById(metadata.lawyerId);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found");
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
        await this._slotRepository.bookSlot(metadata.slotId);

        
        const payment = new Payment(
            '',
            data.id,
            metadata.userId,
            metadata.lawyerId,
            session.amount_total ? session.amount_total / 100 : 0,
            session.currency?.toUpperCase() || 'INR',
            'completed',
            session.payment_intent as string,
            session.payment_method_types?.[0] || 'card',
            new Date(),
            new Date()
        );

        await this._paymentRepository.create(payment);

      
        return new ResponseBookingDetilsDTO(
            data.id,
            data.date,
            data.startTime,
            data.endTime,
            data.consultationFee,
            lawyer.name,
            lawyer.profileImage,
            data.paymentId,
            data.stripeSessionId,
            data.description
        );
    }
}
