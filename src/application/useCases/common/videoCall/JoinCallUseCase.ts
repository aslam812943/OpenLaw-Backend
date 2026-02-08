import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { IJoinCallUseCase } from "../../../interface/use-cases/common/IJoinCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ISocketServer } from "../../../interface/services/ISocketServer";
import { ISendNotificationUseCase } from "../../../interface/use-cases/common/notification/ISendNotificationUseCase";

export class JoinCallUseCase implements IJoinCallUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _socketServer: ISocketServer,
        private _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(bookingId: string): Promise<void> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        await this._bookingRepository.updateCallStatus(bookingId, true, true);

        this._socketServer.sendMessageToRoom(`user-${booking.userId}`, "video-call-lawyer-joined", { bookingId });

        await this._sendNotificationUseCase.execute(
            booking.userId.toString(),
            "Your lawyer has joined the video call. You can join now!",
            "video_call_joined",
            { bookingId }
        );
    }
}
