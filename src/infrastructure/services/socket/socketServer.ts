import { Server, Socket } from 'socket.io';
import { ISendMessageUseCase } from '../../../application/interface/use-cases/common/chat/ISendMessageUseCase';
import { IMarkMessagesAsReadUseCase } from '../../../application/interface/use-cases/common/chat/IMarkMessagesAsReadUseCase';
import { ISocketAuth } from '../../../application/interface/services/ISocketAuth';
import { JoinRoomPayload, SendMessagePayload, MarkReadPayload, VideoJoinPayload, VideoSignalPayload } from './socketTypes';
import { ISocketServer } from '../../../application/interface/services/ISocketServer';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRole } from '../../interface/enums/UserRole';

export class SocketServerService implements ISocketServer {
  private _sendMessageUseCase: ISendMessageUseCase;
  private _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase;
  private _socketAuthService: ISocketAuth;
  private io: Server | null = null;

  constructor(
    sendMessageUseCase: ISendMessageUseCase,
    markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    socketAuthService: ISocketAuth
  ) {
    this._sendMessageUseCase = sendMessageUseCase;
    this._markMessagesAsReadUseCase = markMessagesAsReadUseCase;
    this._socketAuthService = socketAuthService;
  }

  public setupSocketServer(io: Server): void {
    this.io = io;
    io.use(this._socketAuthService.socketAuth.bind(this._socketAuthService));

    io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId
      if (userId) {
        socket.join(`user-${userId}`);
      }

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

            const message = await this._sendMessageUseCase.execute(
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

          await this._markMessagesAsReadUseCase.execute(roomId, userId);


          io.to(roomId).emit("messages-read", { roomId, readBy: userId });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to mark messages as read";
          socket.emit("chat-error", {
            message: errorMessage
          });
        }
      });

      // VIDEO CALL SIGNALING
      socket.on("video-call-join", ({ bookingId }: VideoJoinPayload) => {
        if (!bookingId) return;
        const videoRoomId = `video-${bookingId}`;
        const role = socket.data.role;

        if (role === UserRole.USER) {

          const clients = io.sockets.adapter.rooms.get(videoRoomId);
          let lawyerPresent = false;
          if (clients) {
            for (const clientId of clients) {
              const clientSocket = io.sockets.sockets.get(clientId);
              if (clientSocket?.data.role === UserRole.LAWYER) {
                lawyerPresent = true;
                break;
              }
            }
          }

          if (!lawyerPresent) {
            socket.emit("lawyer-not-joined");
          }
        }

        socket.join(videoRoomId);

        socket.to(videoRoomId).emit("video-call-peer-joined", {
          userId: socket.data.userId,
          socketId: socket.id,
          role: role
        });
      });

      socket.on("video-call-signal", ({ bookingId, signal }: VideoSignalPayload) => {
        const videoRoomId = `video-${bookingId}`;

        socket.to(videoRoomId).emit("video-call-signal", {
          signal,
          from: socket.data.userId,
          fromSocket: socket.id,
          role: socket.data.role
        });
      });

      socket.on("video-call-end", ({ bookingId }: VideoJoinPayload) => {
        const videoRoomId = `video-${bookingId}`;
        io.to(videoRoomId).emit("video-call-ended");

      });

      socket.on("disconnect", () => {
        // console.log(`Socket disconnected: ${socket.id}, UserID: ${userId}`);
      });
    });
  }


  public sendNotification(userId: string, data: string): void {
    if (this.io) {
      this.io.to(`user-${userId}`).emit("notification", JSON.parse(data));
    } else {
      console.log('Socket IO instance not initialized');
    }
  }

  public handleLogout(userId: string): void {
    if (this.io) {
      this.io.to(`user-${userId}`).emit("logout");
    }
  }

  public sendMessageToRoom(roomId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    }
  }
}