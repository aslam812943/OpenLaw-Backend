import { MessageDTO } from "../../../../dtos/chat/MessageDTO";

export interface ISendMessageUseCase {
    execute(roomId: string, senderId: string, content: string, senderRole: 'user' | 'lawyer'): Promise<MessageDTO>;
}
