
import { ICheckChatAccessUseCase } from "../../../interface/use-cases/common/chat/ICheckChatAccessUseCase";
import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";

export class CheckChatAccessUseCase implements ICheckChatAccessUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(userId: string, lawyerId: string): Promise<{ hasAccess: boolean }> {
        const booking = await this.bookingRepository.findActiveBooking(userId, lawyerId);
        return { hasAccess: !!booking };
    }
}
