import { Message } from "../../../../domain/entities/Message";
import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";
import { MessageDTO } from "../../../dtos/chat/MessageDTO";
import { MessageMapper } from "../../../mapper/chat/MessageMapper";
import { ISendMessageUseCase } from "../../../interface/use-cases/common/chat/ISendMessageUseCase";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import crypto from "crypto";


export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(private messageRepo: IMessageRepository) { }

    async execute(
        roomId: string,
        senderId: string,
        content: string,
        senderRole: 'user' | 'lawyer',
        type: "text" | "image" | "video" | "document" = "text",
        fileUrl?: string,
        fileName?: string,
        fileSize?: string
    ): Promise<MessageDTO> {
        if (type === 'text' && !content.trim()) {
            throw new BadRequestError("Message content cannot be empty");
        }

        const message = new Message(
            crypto.randomUUID(),
            roomId,
            senderId,
            senderRole,
            content,
            new Date(),
            type,
            fileUrl,
            fileName,
            fileSize
        );

        await this.messageRepo.save(message);
        return MessageMapper.toDTO(message);
    }
}