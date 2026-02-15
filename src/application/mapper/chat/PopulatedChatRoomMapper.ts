import { PopulatedChatRoom, PopulatedUser, PopulatedLawyer } from "../../../domain/repositories/IChatRoomRepository";
import { PopulatedChatRoomDTO } from "../../dtos/chat/PopulatedChatRoomDTO";

interface IChatRoomDoc {
    _id: string;
    userId: string | PopulatedUser;
    lawyerId: string | PopulatedLawyer;
    bookingId: string;
    createdAt: Date;
    lastMessage?: {
        content: string;
        createdAt: Date;
        type?: string;
    };
    bookingDetails?: {
        bookingId: string;
        startTime: string;
        description: string;
        date: string;
    };
}

export class PopulatedChatRoomMapper {
    static toDTO(chatRoom: PopulatedChatRoom): PopulatedChatRoomDTO {
        return new PopulatedChatRoomDTO(
            chatRoom.id,
            typeof chatRoom.userId === 'string'
                ? chatRoom.userId
                : {
                    _id: chatRoom.userId._id.toString(),
                    name: chatRoom.userId.name,
                    profileImage: chatRoom.userId.profileImage,
                },
            typeof chatRoom.lawyerId === 'string'
                ? chatRoom.lawyerId
                : {
                    _id: chatRoom.lawyerId._id.toString(),
                    name: chatRoom.lawyerId.name,
                    profileImage: chatRoom.lawyerId.profileImage || chatRoom.lawyerId.Profileimageurl,
                },
            chatRoom.bookingId,
            chatRoom.createdAt,
            chatRoom.lastMessage,
            chatRoom.bookingDetails,
            chatRoom.type
        );
    }

    static toDTOArray(chatRooms: PopulatedChatRoom[]): PopulatedChatRoomDTO[] {
        return chatRooms.map(room => this.toDTO(room));
    }

    static fromDocument(doc: IChatRoomDoc): PopulatedChatRoomDTO {
        const chatRoom = doc as unknown as PopulatedChatRoom;
        return new PopulatedChatRoomDTO(
            doc._id.toString(),
            typeof doc.userId === 'string'
                ? doc.userId
                : {
                    _id: doc.userId._id.toString(),
                    name: doc.userId.name,
                    profileImage: doc.userId.profileImage,
                },
            typeof doc.lawyerId === 'string'
                ? doc.lawyerId
                : {
                    _id: doc.lawyerId._id.toString(),
                    name: doc.lawyerId.name,
                    profileImage: doc.lawyerId.profileImage || doc.lawyerId.Profileimageurl,
                },
            doc.bookingId.toString(),
            doc.createdAt,
            chatRoom.lastMessage,
            chatRoom.bookingDetails,
            doc.lastMessage?.type || 'text'
        );
    }
}
