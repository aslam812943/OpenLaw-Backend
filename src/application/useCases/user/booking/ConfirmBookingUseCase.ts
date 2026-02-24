import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IPaymentRepository } from "../../../../domain/repositories/IPaymentRepository";
import { IPaymentService } from "../../../interface/services/IPaymentService";
import { Booking } from "../../../../domain/entities/Booking";
import { Payment } from "../../../../domain/entities/Payment";
import { IConfirmBookingUseCase } from "../../../interface/use-cases/user/IConfirmBookingUseCase";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";
import { IAvailabilityRuleRepository } from '../../../../domain/repositories/lawyer/IAvailabilityRuleRepository';
import { ILawyerRepository } from '../../../../domain/repositories/lawyer/ILawyerRepository';
import { ISubscriptionRepository } from "../../../../domain/repositories/admin/ISubscriptionRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ISendNotificationUseCase } from "../../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IChatRoomRepository } from "../../../../domain/repositories/IChatRoomRepository";
import { ChatRoom } from "../../../../domain/entities/ChatRoom";

export class ConfirmBookingUseCase implements IConfirmBookingUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _paymentService: IPaymentService,
        private _slotRepository: IAvailabilityRuleRepository,
        private _lawyerRepository: ILawyerRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _chatRoomRepository: IChatRoomRepository
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

        if (!metadata.userId) {
            throw new BadRequestError("Missing userId in session metadata");
        }
        if (!metadata.lawyerId) {
            throw new BadRequestError("Missing lawyerId in session metadata");
        }
        if (!metadata.date) {
            throw new BadRequestError("Missing date in session metadata");
        }
        if (!metadata.startTime) {
            throw new BadRequestError("Missing startTime in session metadata");
        }
        if (!metadata.endTime) {
            throw new BadRequestError("Missing endTime in session metadata");
        }


        const lawyer = await this._lawyerRepository.findById(metadata.lawyerId);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found");
        }



        let commissionPercent = 0;
        if (lawyer && lawyer.subscriptionId) {
            const subscription = await this._subscriptionRepository.findById(lawyer.subscriptionId.toString());
            if (subscription) {
                commissionPercent = subscription.commissionPercent;
            }
        }

        const parentBookingId = metadata.parentBookingId && metadata.parentBookingId !== '' ? metadata.parentBookingId : undefined;

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
            metadata.description,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            commissionPercent,
            undefined,
            undefined,
            undefined,
            'none',
            undefined,
            undefined,
            'none',
            parentBookingId
        );


        const data = await this._bookingRepository.create(booking);
        if (metadata.slotId && metadata.slotId !== '') {
            await this._slotRepository.bookSlot(metadata.slotId, metadata.userId, data.id);
        }


        if (parentBookingId) {
            await this._bookingRepository.updateFollowUpStatus(parentBookingId, 'booked');
        }





        const payment = new Payment(
            '',
            metadata.userId,
            metadata.lawyerId,
            session.amount_total ? Number(session.amount_total / 100) : 0,
            session.currency?.toUpperCase() || 'INR',
            'completed',
            session.payment_intent as string,
            session.payment_method_types?.[0] || 'card',
            new Date(),
            new Date(),
            data.id,
            undefined,
            'booking'
        );

        await this._paymentRepository.create(payment);

        if (!parentBookingId) {
            const existingRoom = await this._chatRoomRepository.findByUserAndLawyer(metadata.userId, metadata.lawyerId, data.id);
            if (!existingRoom) {
                await this._chatRoomRepository.save(new ChatRoom('', metadata.userId, metadata.lawyerId, data.id));
            }
        }

        // Notify Lawyer
        await this._sendNotificationUseCase.execute(
            metadata.lawyerId,
            `You have a new booking from a client for ${metadata.date} at ${metadata.startTime}. Booking ID: ${data.bookingId}`,
            'NEW_BOOKING',
            { appointmentId: data.id }
        );


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
