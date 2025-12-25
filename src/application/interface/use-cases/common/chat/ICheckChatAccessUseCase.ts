import { ChatAccessDTO } from "../../../../dtos/chat/ChatAccessDTO";

export interface ICheckChatAccessUseCase {
    execute(userId: string, lawyerId: string): Promise<ChatAccessDTO>;
}
