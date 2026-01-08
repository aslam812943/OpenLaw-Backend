import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";

export class MarkMessagesAsReadUseCase {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(roomId: string, userId: string): Promise<void> {
        if (!roomId || !userId) {
            throw new BadRequestError("Room ID and User ID are required");
        }

        await this.messageRepository.markMessagesAsRead(roomId, userId);
    }
}
