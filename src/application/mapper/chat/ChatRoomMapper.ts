import { ChatRoom } from "../../../domain/entities/ChatRoom";
import { ChatRoomDTO } from "../../dtos/chat/ChatRoomDTO";

export class ChatRoomMapper {
    static toDTO(chatRoom: ChatRoom): ChatRoomDTO {
        return new ChatRoomDTO(
            chatRoom.id,
            chatRoom.userId,
            chatRoom.lawyerId,
            chatRoom.bookingId
        );
    }

    static toDTOArray(chatRooms: ChatRoom[]): ChatRoomDTO[] {
        return chatRooms.map(room => this.toDTO(room));
    }
}
