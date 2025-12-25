import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ChatAccessDTO } from "../../dtos/chat/ChatAccessDTO";
import { ICheckChatAccessUseCase } from "../../interface/use-cases/common/chat/ICheckChatAccessUseCase";

export class CheckChatAccessUseCase implements ICheckChatAccessUseCase {
    constructor(private bookingRepo: IBookingRepository) { }

    async execute(userId: string, lawyerId: string): Promise<ChatAccessDTO> {
        const hasAccess = await this.bookingRepo.existsByUserIdAndLawyerId(userId, lawyerId);
        return new ChatAccessDTO(hasAccess);
    }
}
