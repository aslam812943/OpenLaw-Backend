import {
    IChatRoomRepository,
    PopulatedUser,
    PopulatedLawyer,
    IChatRoomDocumentWithTimestamps,
    PopulatedChatRoom
} from "../../domain/repositories/IChatRoomRepository";
import { ChatRoom } from "../../domain/entities/ChatRoom";
import ChatRoomModel, { IChatRoomDocument } from "../db/models/ChatRoomModel";
import { InternalServerError } from "../errors/InternalServerError";
import { Types } from "mongoose";


export class ChatRoomRepository implements IChatRoomRepository {
    async save(chatRoom: ChatRoom): Promise<ChatRoom> {
        try {
            const { id, ...data } = chatRoom;
            const doc = await ChatRoomModel.create(data);
            return this.mapToEntity(doc);
        } catch (error) {
            throw new InternalServerError("Error saving chat room");
        }
    }

    async findById(id: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findById(id);
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error) {
            throw new InternalServerError("Error finding chat room by ID");
        }
    }

    async findByUserAndLawyer(userId: string, lawyerId: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findOne({ userId, lawyerId });
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error) {
            throw new InternalServerError("Error finding chat room");
        }
    }

    async findByLawyerId(lawyerId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.find({ lawyerId }).populate("userId", "name profileImage");
            return docs.map((doc) => ({
                id: (doc._id as Types.ObjectId).toString(),
                userId: doc.userId as unknown as PopulatedUser,
                lawyerId: doc.lawyerId.toString(),
                bookingId: doc.bookingId.toString(),
                createdAt: (doc as unknown as IChatRoomDocumentWithTimestamps).createdAt
            }));
        } catch (error) {
            throw new InternalServerError("Error finding lawyer chat rooms");
        }
    }

    async findByUserId(userId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.find({ userId }).populate("lawyerId", "name profileImage");
            return docs.map((doc) => ({
                id: (doc._id as Types.ObjectId).toString(),
                userId: doc.userId.toString(),
                lawyerId: doc.lawyerId as unknown as PopulatedLawyer,
                bookingId: doc.bookingId.toString(),
                createdAt: (doc as unknown as IChatRoomDocumentWithTimestamps).createdAt
            }));
        } catch (error) {
            throw new InternalServerError("Error finding user chat rooms");
        }
    }

    private mapToEntity(doc: IChatRoomDocument): ChatRoom {
        return new ChatRoom(doc.id.toString(), doc.userId.toString(), doc.lawyerId.toString(), doc.bookingId.toString());
    }
}
