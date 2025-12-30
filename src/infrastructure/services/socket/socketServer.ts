import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '../../../application/useCases/chat/SendMessageUseCase';
import { MarkMessagesAsReadUseCase } from '../../../application/useCases/chat/MarkMessagesAsReadUseCase';
import { MessageRepository } from '../../repositories/messageRepository';
import { SocketAuthService } from './socketAuth';
import { JoinRoomPayload, SendMessagePayload, MarkReadPayload } from './socketTypes';
import { ISocketServer } from '../../../application/interface/services/ISocketServer';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export class SocketServerService implements ISocketServer {
  private messageRepo: MessageRepository;
  private sendMessageUseCase: SendMessageUseCase;
  private markMessagesAsReadUseCase: MarkMessagesAsReadUseCase;
  private socketAuthService: SocketAuthService;

  constructor() {
    this.messageRepo = new MessageRepository();
    this.sendMessageUseCase = new SendMessageUseCase(this.messageRepo);
    this.markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(this.messageRepo);
    this.socketAuthService = new SocketAuthService();
  }

  public setupSocketServer(io: Server): void {
    io.use(this.socketAuthService.socketAuth.bind(this.socketAuthService));

    io.on("connection", (socket: Socket) => {
      // JOIN ROOM
      socket.on("join-room", ({ roomId }: JoinRoomPayload) => {
        if (!roomId) return;
        socket.join(roomId);
      });

      // SEND MESSAGE
      socket.on(
        "send-message",
        async ({ roomId, content, type, fileUrl, fileName, fileSize }: SendMessagePayload) => {
          try {
            const senderId = socket.data.userId;
            const senderRole = socket.data.role;

            if (!senderId || !senderRole) {
              throw new UnauthorizedError("Unauthorized");
            }

            const message = await this.sendMessageUseCase.execute(
              roomId,
              senderId,
              content,
              senderRole,
              type,
              fileUrl,
              fileName,
              fileSize
            );

            io.to(roomId).emit("new-message", message);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Message failed";
            socket.emit("chat-error", {
              message: errorMessage
            });
          }
        }
      );

      // MARK MESSAGES AS READ
      socket.on("mark-read", async ({ roomId }: MarkReadPayload) => {
        try {
          const userId = socket.data.userId;

          if (!userId) {
            throw new UnauthorizedError("Unauthorized");
          }

          await this.markMessagesAsReadUseCase.execute(roomId, userId);

          // Notify all participants who read the messages
          io.to(roomId).emit("messages-read", { roomId, readBy: userId });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to mark messages as read";
          socket.emit("chat-error", {
            message: errorMessage
          });
        }
      });

      socket.on("disconnect", () => {
        // console.log("Socket disconnected:", socket.id);
      });
    });
  }
}