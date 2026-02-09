import {
    IChatRoomRepository,
    PopulatedUser,
    PopulatedLawyer,
    PopulatedChatRoom
} from "../../domain/repositories/IChatRoomRepository";
import { ChatRoom } from "../../domain/entities/ChatRoom";
import ChatRoomModel, { IChatRoomDocument } from "../db/models/ChatRoomModel";
import { InternalServerError } from "../errors/InternalServerError";
import { MessageConstants } from "../constants/MessageConstants";
import { Types } from "mongoose";


import { IBookingRepository } from "../../domain/repositories/IBookingRepository";

import { BaseRepository } from "./BaseRepository";

export class ChatRoomRepository extends BaseRepository<IChatRoomDocument> implements IChatRoomRepository {
    constructor() {
        super(ChatRoomModel);
    }
    async save(chatRoom: ChatRoom): Promise<ChatRoom> {
        try {
            const { id, ...data } = chatRoom;
            const doc = await ChatRoomModel.create(data);
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findById(id: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findById(id);
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async findByIdPopulated(id: string): Promise<PopulatedChatRoom | null> {
        try {
            const docs = await ChatRoomModel.aggregate([
                { $match: { _id: new Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "messageschemas",
                        let: { roomId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$roomId", "$$roomId"] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 }
                        ],
                        as: "lastMessage"
                    }
                },
                {
                    $unwind: {
                        path: "$lastMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
                },
                { $unwind: "$userId" },
                {
                    $lookup: {
                        from: "lawyers",
                        localField: "lawyerId",
                        foreignField: "_id",
                        as: "lawyerId"
                    }
                },
                { $unwind: "$lawyerId" }
            ]);

            if (docs.length === 0) return null;
            const doc = docs[0];

            return {
                id: doc._id.toString(),
                userId: doc.userId as unknown as PopulatedUser,
                lawyerId: {
                    _id: doc.lawyerId._id,
                    name: doc.lawyerId.name,
                    profileImage: doc.lawyerId.profileImage || doc.lawyerId.Profileimageurl
                } as unknown as PopulatedLawyer,
                bookingId: doc.bookingId.toString(),
                createdAt: doc.createdAt,
                lastMessage: doc.lastMessage ? {
                    content: doc.lastMessage.content,
                    createdAt: doc.lastMessage.createdAt
                } : undefined
            };
        } catch (error: unknown) {
            console.error(error);
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findByUserAndLawyer(userId: string, lawyerId: string, bookingId?: string): Promise<ChatRoom | null> {
        try {
            const query: any = { userId, lawyerId };
            if (bookingId) query.bookingId = bookingId;
            const doc = await ChatRoomModel.findOne(query);
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    async findByBookingId(bookingId: string): Promise<ChatRoom | null> {
        try {
            const doc = await ChatRoomModel.findOne({ bookingId });
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    async findByLawyerId(lawyerId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.aggregate([
                { $match: { lawyerId: new Types.ObjectId(lawyerId) } },
                {
                    $lookup: {
                        from: "messageschemas",
                        let: { roomId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$roomId", "$$roomId"] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 }
                        ],
                        as: "lastMessage"
                    }
                },
                {
                    $unwind: {
                        path: "$lastMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
                },
                { $unwind: "$userId" },
                { $sort: { "lastMessage.createdAt": -1, updatedAt: -1 } }
            ]);

            return docs.map((doc) => ({
                id: doc._id.toString(),
                userId: doc.userId as unknown as PopulatedUser,
                lawyerId: doc.lawyerId.toString(),
                bookingId: doc.bookingId.toString(),
                createdAt: doc.createdAt,
                lastMessage: doc.lastMessage ? {
                    content: doc.lastMessage.content,
                    createdAt: doc.lastMessage.createdAt
                } : undefined
            }));
        } catch (error: unknown) {
            console.error(error);
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findByUserId(userId: string): Promise<PopulatedChatRoom[]> {
        try {
            const docs = await ChatRoomModel.aggregate([
                { $match: { userId: new Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: "messageschemas",
                        let: { roomId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$roomId", "$$roomId"] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 }
                        ],
                        as: "lastMessage"
                    }
                },
                {
                    $unwind: {
                        path: "$lastMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "lawyers",
                        localField: "lawyerId",
                        foreignField: "_id",
                        as: "lawyerId"
                    }
                },
                { $unwind: "$lawyerId" },
                { $sort: { "lastMessage.createdAt": -1, updatedAt: -1 } }
            ]);

            return docs.map((doc) => ({
                id: doc._id.toString(),
                userId: doc.userId.toString(),
                lawyerId: {
                    _id: doc.lawyerId._id,
                    name: doc.lawyerId.name,
                    profileImage: doc.lawyerId.profileImage || doc.lawyerId.Profileimageurl
                } as unknown as PopulatedLawyer,
                bookingId: doc.bookingId.toString(),
                createdAt: doc.createdAt,
                lastMessage: doc.lastMessage ? {
                    content: doc.lastMessage.content,
                    createdAt: doc.lastMessage.createdAt
                } : undefined
            }));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async updateBookingId(roomId: string, bookingId: string): Promise<void> {
        try {
            await ChatRoomModel.findByIdAndUpdate(roomId, { bookingId });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
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
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async updateLastMessage(roomId: string): Promise<void> {
        try {
            await ChatRoomModel.findByIdAndUpdate(roomId, { updatedAt: new Date() });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    private mapToEntity(doc: IChatRoomDocument): ChatRoom {
        return new ChatRoom(String(doc._id), doc.userId.toString(), doc.lawyerId.toString(), doc.bookingId.toString());
    }
}
