import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";

export class MarkMessagesAsReadUseCase {
    constructor(private _messageRepository: IMessageRepository) { }

    async execute(roomId: string, userId: string): Promise<void> {
        if (!roomId || !userId) {
            throw new BadRequestError("Room ID and User ID are required");
        }

        await this._messageRepository.markMessagesAsRead(roomId, userId);
    }
}
