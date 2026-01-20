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


import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

export class ChatRoomRepository implements IChatRoomRepository {
    async save(chatRoom: ChatRoom): Promise<ChatRoom> {
        try {
            const { id, ...data } = chatRoom;
            const doc = await ChatRoomModel.create(data);
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError("Error saving chat room");
        }
    }

    async findById(id: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findById(id);
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError("Error finding chat room by ID");
        }
    }

    async findByIdPopulated(id: string): Promise<PopulatedChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findById(id)
                .populate("userId", "name profileImage")
                .populate("lawyerId", "name profileImage");

            if (!doc) return null;

            return {
                id: (doc._id as Types.ObjectId).toString(),
                userId: doc.userId as unknown as PopulatedUser,
                lawyerId: doc.lawyerId as unknown as PopulatedLawyer,
                bookingId: doc.bookingId.toString(),
                createdAt: (doc as unknown as { createdAt: Date }).createdAt
            };
        } catch (error: unknown) {
            throw new InternalServerError("Error finding populated chat room by ID");
        }
    }

    async findByUserAndLawyer(userId: string, lawyerId: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findOne({ userId, lawyerId });
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError("Error finding chat room");
        }
    }

    async findByLawyerId(lawyerId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.find({ lawyerId })
                .populate("userId", "name profileImage")
                .sort({ updatedAt: -1 });
            return docs.map((doc) => ({
                id: (doc._id as Types.ObjectId).toString(),
                userId: doc.userId as unknown as PopulatedUser,
                lawyerId: doc.lawyerId.toString(),
                bookingId: doc.bookingId.toString(),
                createdAt: (doc as unknown as { createdAt: Date }).createdAt
            }));
        } catch (error: unknown) {
            throw new InternalServerError("Error finding lawyer chat rooms");
        }
    }

    async findByUserId(userId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.find({ userId })
                .populate("lawyerId", "name profileImage")
                .sort({ updatedAt: -1 });
            return docs.map((doc) => ({
                id: (doc._id as Types.ObjectId).toString(),
                userId: doc.userId.toString(),
                lawyerId: doc.lawyerId as unknown as PopulatedLawyer,
                bookingId: doc.bookingId.toString(),
                createdAt: (doc as unknown as { createdAt: Date }).createdAt
            }));
        } catch (error: unknown) {
            throw new InternalServerError("Error finding user chat rooms");
        }
    }

    async updateBookingId(roomId: string, bookingId: string): Promise<void> {
        try {
            await ChatRoomModel.findByIdAndUpdate(roomId, { bookingId });
        } catch (error: unknown) {
            throw new InternalServerError("Error updating chat room booking ID");
        }
    }

    async syncChatRoom(userId: string, lawyerId: string, bookingRepo: IBookingRepository): Promise<void> {
        try {
            const activeBooking = await bookingRepo.findActiveBooking(userId, lawyerId);
            if (!activeBooking) return;

            const room = await ChatRoomModel.findOne({ userId, lawyerId });
            if (room && room.bookingId.toString() !== activeBooking.id) {
                await ChatRoomModel.findByIdAndUpdate(room._id, { bookingId: activeBooking.id });
            }
        } catch (error: unknown) {
            throw new InternalServerError("Error synchronizing chat room booking ID");
        }
    }

    async updateLastMessage(roomId: string): Promise<void> {
        try {
            await ChatRoomModel.findByIdAndUpdate(roomId, { updatedAt: new Date() });
        } catch (error: unknown) {
            throw new InternalServerError("Error updating chat room last message time");
        }
    }

    private mapToEntity(doc: IChatRoomDocument): ChatRoom {
        return new ChatRoom(String(doc._id), doc.userId.toString(), doc.lawyerId.toString(), doc.bookingId.toString());
    }
}
