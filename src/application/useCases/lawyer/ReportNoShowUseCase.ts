import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { IReportNoShowUseCase } from "../../interface/use-cases/lawyer/IReportNoShowUseCase";
import { IDatabaseSessionFactory } from "../../../domain/interfaces/IDatabaseSession";

export class ReportNoShowUseCase implements IReportNoShowUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _lawyerRepository: ILawyerRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _adminRepository: IAdminRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase,
        private readonly _sessionFactory: IDatabaseSessionFactory
    ) { }

    async execute(bookingId: string): Promise<void> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.status !== 'confirmed') {
            throw new BadRequestError("Only confirmed bookings can be reported as no-show.");
        }

        const effortThresholdSeconds = 180;
        const currentEffort = booking.lawyerCallDuration || 0;

        if (currentEffort < effortThresholdSeconds) {
            const minutesTracked = Math.floor(currentEffort / 60);
            const secondsTracked = currentEffort % 60;
            throw new BadRequestError(`Proof of Effort: You must stay in the video call room for at least 1 minute. System tracked your presence for ${minutesTracked}m ${secondsTracked}s. Please stay longer.`);
        }

        if ((booking.callDuration || 0) >= 60) {
            throw new BadRequestError("User has joined the call for a meaningful duration. Cannot mark as no-show.");
        }

        const dbSession = await this._sessionFactory.createSession();
        await dbSession.startTransaction();

        try {
            const session = dbSession.getSession();
            await this._bookingRepository.updateStatus(bookingId, 'completed', undefined, undefined, "User No-Show", session);

            await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), booking.consultationFee, session);
            await this._walletRepository.addTransaction(booking.lawyerId.toString(), booking.consultationFee, {
                type: 'credit',
                amount: booking.consultationFee,
                date: new Date(),
                status: 'completed',
                bookingId: bookingId,
                description: `Consultation fee: ${booking.bookingId} (User No-Show)`,
                metadata: {
                    displayId: booking.bookingId,
                    note: "User did not join the video call"
                }
            }, session);

            // Handle commission
            const commissionAmount = booking.consultationFee * (booking.commissionPercent / 100);
            if (commissionAmount > 0) {
                await this._lawyerRepository.updateWalletBalance(booking.lawyerId.toString(), -commissionAmount, session);
                await this._adminRepository.updateWalletBalance(commissionAmount, session);
                await this._walletRepository.addTransaction(booking.lawyerId.toString(), -commissionAmount, {
                    type: 'debit',
                    amount: commissionAmount,
                    date: new Date(),
                    status: 'completed',
                    bookingId: bookingId,
                    description: `Platform commission for ${booking.bookingId} (No-Show)`,
                    metadata: {
                        displayId: booking.bookingId
                    }
                }, session);
            }

            await this._sendNotificationUseCase.execute(
                booking.userId.toString(),
                `Your consultation ${booking.bookingId} was marked as completed (User No-Show).`,
                'APPOINTMENT_COMPLETED',
                { appointmentId: bookingId }
            );

            await dbSession.commitTransaction();
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }
    }
}
