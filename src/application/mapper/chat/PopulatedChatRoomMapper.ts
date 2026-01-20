import { PopulatedChatRoom, PopulatedUser, PopulatedLawyer } from "../../../domain/repositories/IChatRoomRepository";
import { PopulatedChatRoomDTO } from "../../dtos/chat/PopulatedChatRoomDTO";
import { Types } from "mongoose";

interface IChatRoomDoc {
    _id: Types.ObjectId;
    userId: string | PopulatedUser;
    lawyerId: string | PopulatedLawyer;
    bookingId: Types.ObjectId | string;
    createdAt: Date;
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

    static fromDocument(doc: IChatRoomDoc): PopulatedChatRoomDTO {
        return new PopulatedChatRoomDTO(
            doc._id.toString(),
            typeof doc.userId === 'string'
                ? doc.userId
                : {
                    _id: doc.userId._id.toString(),
                    name: doc.userId.name,
                    profileImage: doc.userId.profileImage
                },
            typeof doc.lawyerId === 'string'
                ? doc.lawyerId
                : {
                    _id: doc.lawyerId._id.toString(),
                    name: doc.lawyerId.name,
                    profileImage: doc.lawyerId.profileImage
                },
            doc.bookingId.toString(),
            doc.createdAt
        );
    }
}
