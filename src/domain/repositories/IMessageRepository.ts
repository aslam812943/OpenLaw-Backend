import { Message } from "../entities/Message";

export interface IMessageRepository {
    save(message: Message): Promise<void>
    getByRoom(roomId: string): Promise<Message[]>
    markMessagesAsRead(roomId: string, userId: string): Promise<void>
}