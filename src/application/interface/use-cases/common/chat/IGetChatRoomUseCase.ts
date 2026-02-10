import { ChatRoomDTO } from "../../../../dtos/chat/ChatRoomDTO";
import { PopulatedChatRoomDTO } from "../../../../dtos/chat/PopulatedChatRoomDTO";

export interface IGetChatRoomUseCase {
    execute(userId: string, lawyerId: string, bookingId?: string): Promise<ChatRoomDTO>;
    getById(roomId: string): Promise<PopulatedChatRoomDTO>;
    getByUser(userId: string): Promise<PopulatedChatRoomDTO[]>;
    getByLawyer(lawyerId: string): Promise<PopulatedChatRoomDTO[]>;
    getLawyerSpecificRooms(userId: string, lawyerId: string): Promise<PopulatedChatRoomDTO[]>;
}
