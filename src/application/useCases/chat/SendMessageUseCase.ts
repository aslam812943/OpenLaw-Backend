import { Message } from "../../../domain/entities/Message";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { MessageDTO } from "../../dtos/chat/MessageDTO";
import { MessageMapper } from "../../mapper/chat/MessageMapper";
import { ISendMessageUseCase } from "../../interface/use-cases/common/chat/ISendMessageUseCase";
import crypto from "crypto";


export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(private messageRepo: IMessageRepository) { }

    async execute(roomId: string, senderId: string, content: string, senderRole: 'user' | 'lawyer'): Promise<MessageDTO> {
        if (!content.trim()) {
            throw new Error("Message content cannot be empty");
        }

        const message = new Message(
            crypto.randomUUID(),
            roomId,
            senderId,
            senderRole,
            content,
            new Date()
        );

        await this.messageRepo.save(message);
        return MessageMapper.toDTO(message);
    }
}