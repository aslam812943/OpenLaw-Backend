import MessageModel from "../db/models/MessageModel";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";

export class MessageRepository implements IMessageRepository {

  async save(message: Message): Promise<void> {
    await MessageModel.create({
      roomId: message.roomId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      content: message.content,
      createdAt: message.createdAt
    });
  }

  async getByRoom(roomId: string): Promise<Message[]> {
    const docs = await MessageModel
      .find({ roomId })
      .sort({ createdAt: 1 });

    return docs.map(doc =>
      new Message(
        doc.id.toString(),
        doc.roomId.toString(),
        doc.senderId.toString(),
        doc.senderRole,
        doc.content,
        doc.createdAt
      )
    );
  }
}
