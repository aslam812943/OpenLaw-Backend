import { Message } from "../../../domain/entities/Message";
import { MessageDTO } from "../../dtos/chat/MessageDTO";

export class MessageMapper {
    static toDTO(message: Message): MessageDTO {
        return new MessageDTO(
            message.id,
            message.roomId,
            message.senderId,
            message.senderRole,
            message.content,
            message.createdAt,
            message.type,
            message.fileUrl,
            message.fileName,
            message.fileSize,
            message.readAt
        );
    }

    static toDTOArray(messages: Message[]): MessageDTO[] {
        return messages.map(message => this.toDTO(message));
    }
}
