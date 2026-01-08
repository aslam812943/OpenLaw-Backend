import { ChatRoom } from "../entities/ChatRoom";
import { IChatRoomDocument } from "../../infrastructure/db/models/ChatRoomModel";
import { Document, Types } from "mongoose";
import { IBookingRepository } from "./IBookingRepository";

export interface PopulatedUser {
    _id: Types.ObjectId;
    name: string;
    profileImage?: string;
}

export interface PopulatedLawyer {
    _id: Types.ObjectId;
    name: string;
    profileImage?: string;
}

export interface IChatRoomDocumentWithTimestamps extends IChatRoomDocument, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface PopulatedChatRoomForLawyer extends Omit<IChatRoomDocumentWithTimestamps, 'userId'> {
    userId: PopulatedUser;
}

export interface PopulatedChatRoomForUser extends Omit<IChatRoomDocumentWithTimestamps, 'lawyerId'> {
    lawyerId: PopulatedLawyer;
}

export interface PopulatedChatRoom {
    id: string;
    userId: string | PopulatedUser;
    lawyerId: string | PopulatedLawyer;
    bookingId: string;
    createdAt: Date;
}

export interface IChatRoomRepository {
    save(chatRoom: ChatRoom): Promise<ChatRoom>;
    findById(id: string): Promise<ChatRoom | null>;
    findByUserAndLawyer(userId: string, lawyerId: string): Promise<ChatRoom | null>;
    findByLawyerId(lawyerId: string): Promise<PopulatedChatRoom[]>;
    findByUserId(userId: string): Promise<PopulatedChatRoom[]>;
    updateBookingId(roomId: string, bookingId: string): Promise<void>;
    syncChatRoom(userId: string, lawyerId: string, bookingRepo: IBookingRepository): Promise<void>;
}
