
import { ICheckChatAccessUseCase } from "../../../interface/use-cases/common/chat/ICheckChatAccessUseCase";
import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";

export class CheckChatAccessUseCase implements ICheckChatAccessUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(userId: string, lawyerId: string): Promise<{ hasAccess: boolean }> {
        const booking = await this._bookingRepository.findActiveBooking(userId, lawyerId);
        return { hasAccess: !!booking };
    }
}
