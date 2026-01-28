import { MessageDTO } from "../../../../dtos/chat/MessageDTO";

export interface ISendMessageUseCase {
    execute(
        roomId: string,
        senderId: string,
        content: string,
        senderRole: 'user' | 'lawyer',
        type?: "text" | "image" | "video" | "document",
        fileUrl?: string,
        fileName?: string,
        fileSize?: string
    ): Promise<MessageDTO>;
}
