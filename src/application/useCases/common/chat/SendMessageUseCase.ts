import { Message } from "../../../../domain/entities/Message";
import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";
import { MessageDTO } from "../../../dtos/chat/MessageDTO";
import { MessageMapper } from "../../../mapper/chat/MessageMapper";
import { ISendMessageUseCase } from "../../../interface/use-cases/common/chat/ISendMessageUseCase";
import { BadRequestError } from "../../../../infrastructure/errors/BadRequestError";
import crypto from "crypto";
import { IChatRoomRepository } from "../../../../domain/repositories/IChatRoomRepository";


export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private _messageRepository: IMessageRepository,
        private _chatRoomRepository: IChatRoomRepository
    ) { }

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

        await this._messageRepository.save(message);
        await this._chatRoomRepository.updateLastMessage(roomId);

        return MessageMapper.toDTO(message);
    }
}