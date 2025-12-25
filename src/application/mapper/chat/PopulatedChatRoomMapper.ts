import { PopulatedChatRoom } from "../../../domain/repositories/IChatRoomRepository";
import { PopulatedChatRoomDTO } from "../../dtos/chat/PopulatedChatRoomDTO";
import { Types } from "mongoose";

export class PopulatedChatRoomMapper {
    static toDTO(chatRoom: PopulatedChatRoom): PopulatedChatRoomDTO {
        return new PopulatedChatRoomDTO(
            chatRoom.id,
            typeof chatRoom.userId === 'string'
                ? chatRoom.userId
                : {
                    _id: chatRoom.userId._id.toString(),
                    name: chatRoom.userId.name,
                    profileImage: chatRoom.userId.profileImage
                },
            typeof chatRoom.lawyerId === 'string'
                ? chatRoom.lawyerId
                : {
                    _id: chatRoom.lawyerId._id.toString(),
                    name: chatRoom.lawyerId.name,
                    profileImage: chatRoom.lawyerId.profileImage
                },
            chatRoom.bookingId,
            chatRoom.createdAt
        );
    }

    static toDTOArray(chatRooms: PopulatedChatRoom[]): PopulatedChatRoomDTO[] {
        return chatRooms.map(room => this.toDTO(room));
    }

    static fromDocument(doc: any): PopulatedChatRoomDTO {
        return new PopulatedChatRoomDTO(
            (doc._id as Types.ObjectId).toString(),
            doc.userId,
            doc.lawyerId,
            doc.bookingId.toString(),
            doc.createdAt
        );
    }
}
