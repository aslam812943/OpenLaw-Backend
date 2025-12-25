import { MessageDTO } from "../../../../dtos/chat/MessageDTO";

export interface IGetMessagesUseCase {
    execute(roomId: string): Promise<MessageDTO[]>;
}
