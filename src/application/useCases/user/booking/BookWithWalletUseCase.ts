import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IPaymentRepository } from "../../../../domain/repositories/IPaymentRepository";
import { Booking } from "../../../../domain/entities/Booking";
import { Payment } from "../../../../domain/entities/Payment";
import { IBookWithWalletUseCase } from "../../../interface/use-cases/user/IBookWithWalletUseCase";
import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";
import { IAvailabilityRuleRepository } from '../../../../domain/repositories/lawyer/IAvailabilityRuleRepository';
import { ILawyerRepository } from '../../../../domain/repositories/lawyer/ILawyerRepository';
import { ISubscriptionRepository } from "../../../../domain/repositories/admin/ISubscriptionRepository";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ISendNotificationUseCase } from "../../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { IChatRoomRepository } from "../../../../domain/repositories/IChatRoomRepository";
import { ChatRoom } from "../../../../domain/entities/ChatRoom";
import { WalletTransaction } from "../../../../domain/entities/Wallet";
import { MessageConstants } from "../../../../infrastructure/constants/MessageConstants";
import { IDatabaseSessionFactory } from "../../../../domain/interfaces/IDatabaseSession";

export class BookWithWalletUseCase implements IBookWithWalletUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _slotRepository: IAvailabilityRuleRepository,
        private _lawyerRepository: ILawyerRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _walletRepository: IWalletRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _chatRoomRepository: IChatRoomRepository,
        private _sessionFactory: IDatabaseSessionFactory
    ) { }

    async execute(bookingDetails: BookingDTO): Promise<ResponseBookingDetilsDTO> {
        const { userId, lawyerId, consultationFee, slotId, parentBookingId } = bookingDetails;

        const lawyer = await this._lawyerRepository.findById(lawyerId);
        if (!lawyer) {
            throw new NotFoundError("Lawyer not found");
        }

        if (slotId) {
            const slot = await this._slotRepository.getSlotById(slotId);
            if (!slot) {
                throw new BadRequestError("Slot not found.");
            }

            if (slot.restrictedTo && slot.restrictedTo !== userId) {
                throw new BadRequestError("This slot is reserved for a specific follow-up appointment.");
            }


            const now = new Date();
            const [year, month, day] = slot.date.split('-').map(Number);
            const [hours, minutes] = slot.startTime.split(':').map(Number);
            const slotDateTime = new Date(year, month - 1, day, hours, minutes);

            if (slotDateTime <= now) {
                throw new BadRequestError(MessageConstants.BOOKING.SLOT_EXPIRED);
            }

            const reserved = await this._slotRepository.reserveSlot(slotId, userId, 2);
            if (!reserved) {
                throw new BadRequestError(MessageConstants.BOOKING.SLOT_ALREADY_TAKEN);
            }
        }

        const wallet = await this._walletRepository.findByUserId(userId);
        if (!wallet || wallet.balance < consultationFee) {
            if (slotId) await this._slotRepository.releaseSlot(slotId);
            throw new BadRequestError("Insufficient wallet balance");
        }

        let commissionPercent = 0;
        if (lawyer.subscriptionId) {
            const subscription = await this._subscriptionRepository.findById(lawyer.subscriptionId.toString());
            if (subscription) {
                commissionPercent = subscription.commissionPercent;
            }
        }

        const dbSession = await this._sessionFactory.createSession();
        await dbSession.startTransaction();

        try {
            const session = dbSession.getSession();
            const booking = new Booking(
                '',
                userId,
                lawyerId,
                bookingDetails.date,
                bookingDetails.startTime,
                bookingDetails.endTime,
                consultationFee,
                'pending',
                'paid',
                'WALLET_PAYMENT',
                `WALLET_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                bookingDetails.description,
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
                parentBookingId,
                undefined,
                0,
                0,
                0,
                0,
                false
            );


            const data = await this._bookingRepository.create(booking, session);


            const walletTransaction: WalletTransaction = {
                type: 'debit',
                amount: consultationFee,
                date: new Date(),
                status: 'completed',
                bookingId: data.id,
                description: `Payment for consultation with ${lawyer.name}`,
                metadata: {
                    lawyerName: lawyer.name,
                    lawyerId: lawyer.id,
                    date: bookingDetails.date,
                    time: bookingDetails.startTime,
                    displayId: data.bookingId
                }
            };
            await this._walletRepository.addTransaction(userId, -consultationFee, walletTransaction, session);

            if (slotId) {
                const booked = await this._slotRepository.bookSlot(slotId, userId, data.id, session);
                if (!booked) {
                    throw new Error("SLOT_TAKEN_OR_EXPIRED");
                }
            }

            if (parentBookingId) {
                await this._bookingRepository.updateFollowUpStatus(parentBookingId, 'booked');
            }

            const payment = new Payment(
                '',
                userId,
                lawyerId,
                consultationFee,
                'INR',
                'completed',
                'WALLET_PAYMENT',
                'wallet',
                new Date(),
                new Date(),
                data.id,
                undefined,
                'booking'
            );
            await this._paymentRepository.create(payment);

            if (!parentBookingId) {
                const existingRoom = await this._chatRoomRepository.findByUserAndLawyer(userId, lawyerId, data.id);
                if (!existingRoom) {
                    await this._chatRoomRepository.save(new ChatRoom('', userId, lawyerId, data.id));
                }
            }

            await dbSession.commitTransaction();


            this._sendNotificationUseCase.execute(
                lawyerId,
                `You have a new booking (paid via Wallet) from a client for ${bookingDetails.date} at ${bookingDetails.startTime}. Booking ID: ${data.bookingId}`,
                'NEW_BOOKING',
                { appointmentId: data.id }
            ).catch(err => console.error("Notification failed", err));

            return new ResponseBookingDetilsDTO(
                data.id,
                data.date,
                data.startTime,
                data.endTime,
                data.consultationFee,
                lawyer.name,
                lawyer.profileImage,
                'WALLET_PAYMENT',
                'WALLET',
                data.description
            );

        } catch (error: unknown) {
            await dbSession.abortTransaction();
            if (slotId) await this._slotRepository.releaseSlot(slotId);

            if (error instanceof Error && error.message === "SLOT_TAKEN_OR_EXPIRED") {
                throw new BadRequestError(MessageConstants.BOOKING.SLOT_ALREADY_TAKEN);
            }
            throw new BadRequestError(MessageConstants.BOOKING.TRANSACTION_ERROR);
        } finally {
            dbSession.endSession();
        }
    }
}
