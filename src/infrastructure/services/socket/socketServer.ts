import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '../../../application/useCases/chat/SendMessageUseCase';
import { MessageRepository } from '../../repositories/messageRepository';
import { SocketAuthService } from './socketAuth';
import { JoinRoomPayload, SendMessagePayload } from './socketTypes';
import { ISocketServer } from '../../../application/interface/services/ISocketServer';

export class SocketServerService implements ISocketServer {
  private messageRepo: MessageRepository;
  private sendMessageUseCase: SendMessageUseCase;
  private socketAuthService: SocketAuthService;

  constructor() {
    this.messageRepo = new MessageRepository();
    this.sendMessageUseCase = new SendMessageUseCase(this.messageRepo);
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
        async ({ roomId, content }: SendMessagePayload) => {
          try {
            const senderId = socket.data.userId;
            const senderRole = socket.data.role;

            if (!senderId || !senderRole) {
              throw new Error("Unauthorized");
            }

            const message = await this.sendMessageUseCase.execute(
              roomId,
              senderId,
              content,
              senderRole,
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

      socket.on("disconnect", () => {
        // console.log("Socket disconnected:", socket.id);
      });
    });
  }
}