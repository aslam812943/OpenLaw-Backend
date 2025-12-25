import { ChatRoomDTO } from "../../../../dtos/chat/ChatRoomDTO";
import { PopulatedChatRoomDTO } from "../../../../dtos/chat/PopulatedChatRoomDTO";

export interface IGetChatRoomUseCase {
    execute(userId: string, lawyerId: string): Promise<ChatRoomDTO>;
    getById(roomId: string): Promise<ChatRoomDTO>;
    getByUser(userId: string): Promise<PopulatedChatRoomDTO[]>;
    getByLawyer(lawyerId: string): Promise<PopulatedChatRoomDTO[]>;
}
