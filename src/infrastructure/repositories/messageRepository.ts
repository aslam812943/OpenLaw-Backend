import MessageModel from "../db/models/MessageModel";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";

import { BaseRepository } from "./BaseRepository";
import { IMessageDocument } from "../db/models/MessageModel";
import { MessageConstants } from "../constants/MessageConstants";
import { InternalServerError } from "../errors/InternalServerError";

export class MessageRepository extends BaseRepository<IMessageDocument> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async save(message: Message): Promise<void> {
    try {
      await MessageModel.create({
        roomId: message.roomId,
        senderId: message.senderId,
        senderRole: message.senderRole,
        content: message.content,
        type: message.type,
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileSize: message.fileSize,
        readAt: message.readAt || null,
        createdAt: message.createdAt
      });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
    }
  }

  async getByRoom(roomId: string): Promise<Message[]> {
    try {
      const docs = await MessageModel
        .find({ roomId })
        .sort({ createdAt: 1 });

      return docs.map(doc =>
        new Message(
          String(doc._id),
          doc.roomId.toString(),
          doc.senderId.toString(),
          doc.senderRole,
          doc.content,
          doc.createdAt,
          doc.type,
          doc.fileUrl,
          doc.fileName,
          doc.fileSize,
          doc.readAt
        )
      );
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
    }
  }

  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    try {
      await MessageModel.updateMany(
        {
          roomId,
          senderId: { $ne: userId },
          readAt: null
        },
        {
          $set: { readAt: new Date() }
        }
      );
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
    }
  }

  async deleteByRoomId(roomId: string): Promise<void> {
    try {
      await MessageModel.deleteMany({ roomId: roomId });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.DELETE_ERROR);
    }
  }
}
