import { Server, Socket } from 'socket.io';
import { ISendMessageUseCase } from '../../../application/interface/use-cases/common/chat/ISendMessageUseCase';
import { IMarkMessagesAsReadUseCase } from '../../../application/interface/use-cases/common/chat/IMarkMessagesAsReadUseCase';
import { IEndCallUseCase } from '../../../application/interface/use-cases/common/IEndCallUseCase';
import { ISocketAuth } from '../../../application/interface/services/ISocketAuth';
import logger from '../../logging/logger';
import { JoinRoomPayload, SendMessagePayload, MarkReadPayload, VideoJoinPayload, VideoSignalPayload } from './socketTypes';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IChatRoomRepository } from '../../../domain/repositories/IChatRoomRepository';
import { ISocketServer } from '../../../application/interface/services/ISocketServer';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRole } from '../../interface/enums/UserRole';

export class SocketServerService implements ISocketServer {
  private _sendMessageUseCase: ISendMessageUseCase;
  private _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase;
  private _endCallUseCase: IEndCallUseCase;
  private _socketAuthService: ISocketAuth;
  private _bookingRepository: IBookingRepository;
  private _chatRoomRepository: IChatRoomRepository;
  private io: Server | null = null;
  private callStartTimes: Map<string, number> = new Map();
  private userJoinedRooms: Map<string, boolean> = new Map();

  constructor(
    sendMessageUseCase: ISendMessageUseCase,
    markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
    socketAuthService: ISocketAuth,
    bookingRepository: IBookingRepository,
    chatRoomRepository: IChatRoomRepository,
    endCallUseCase: IEndCallUseCase
  ) {
    this._sendMessageUseCase = sendMessageUseCase;
    this._markMessagesAsReadUseCase = markMessagesAsReadUseCase;
    this._socketAuthService = socketAuthService;
    this._bookingRepository = bookingRepository;
    this._chatRoomRepository = chatRoomRepository;
    this._endCallUseCase = endCallUseCase;
  }

  public setupSocketServer(io: Server): void {
    this.io = io;
    io.use(this._socketAuthService.socketAuth.bind(this._socketAuthService));

    io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId;
      const role = socket.data.role;

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

        if (role === UserRole.USER) {
          this.userJoinedRooms.set(bookingId, true);
        }

        socket.join(videoRoomId);

        socket.to(videoRoomId).emit("video-call-peer-joined", {
          userId: socket.data.userId,
          socketId: socket.id,
          role: role
        });

        // Trigger "Video call started" message
        if (role === UserRole.LAWYER) {
          (async () => {
            try {
              const room = await this._chatRoomRepository.findByBookingId(bookingId);
              if (room && !this.callStartTimes.has(bookingId)) {
                this.callStartTimes.set(bookingId, Date.now());
                const message = await this._sendMessageUseCase.execute(
                  room.id,
                  socket.data.userId,
                  "Video call started",
                  UserRole.LAWYER,
                  "call"
                );
                this.io?.to(room.id).emit("new-message", message);
              }
            } catch (error) {
              logger.error("Failed to send call start message", error);
            }
          })();
        }
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

      socket.on("video-call-end", async ({ bookingId }: VideoJoinPayload) => {
        const videoRoomId = `video-${bookingId}`;
        this.io?.to(videoRoomId).emit("video-call-ended");

       
        try {
          await this._endCallUseCase.execute(bookingId);
        } catch (error) {
          logger.error("Failed to reset call status on backend", error);
        }


        try {
          const room = await this._chatRoomRepository.findByBookingId(bookingId);
          if (room) {
            const otherPartyId = socket.data.role === UserRole.LAWYER ? room.userId : room.lawyerId;
            const otherRole = socket.data.role === UserRole.LAWYER ? "user" : "lawyer";
            this.io?.to(`${otherRole}-${otherPartyId}`).emit("video-call-ended", { bookingId });
          }
        } catch (error) {
          logger.error("Failed to notify other party of call end", error);
        }

        // Trigger "Video call ended" or "Missed call" message
        (async () => {
          try {
            const startTime = this.callStartTimes.get(bookingId);
            const userJoined = this.userJoinedRooms.get(bookingId);

            if (startTime) {
              const room = await this._chatRoomRepository.findByBookingId(bookingId);
              if (room) {
                let statusMessage = "";
                if (!userJoined) {
                  statusMessage = "Missed video call";
                } else {
                  const durationMs = Date.now() - startTime;
                  const seconds = Math.floor((durationMs / 1000) % 60);
                  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
                  const hours = Math.floor(durationMs / (1000 * 60 * 60));

                  let durationStr = "";
                  if (hours > 0) durationStr += `${hours}h `;
                  if (minutes > 0 || hours > 0) durationStr += `${minutes}m `;
                  durationStr += `${seconds}s`;
                  statusMessage = `Video call ended (${durationStr})`;
                }

                const message = await this._sendMessageUseCase.execute(
                  room.id,
                  socket.data.userId,
                  statusMessage,
                  socket.data.role,
                  "call"
                );
                this.io?.to(room.id).emit("new-message", message);
              }
              this.callStartTimes.delete(bookingId);
              this.userJoinedRooms.delete(bookingId);
            }
          } catch (error) {
            logger.error("Failed to send call end message", error);
          }
        })();
      });

      socket.on("video-call-pulse", async ({ bookingId }: VideoJoinPayload) => {
        const role = socket.data.role;
        const userId = socket.data.userId;

        logger.info(`[VideoPulse] Received from User=${userId}, Role=${role}, Booking=${bookingId}`);

        if (!bookingId) return;

        if (role === UserRole.LAWYER) {
          await this._bookingRepository.incrementLawyerCallDuration(bookingId, 10);
          logger.info(`[VideoPulse] Incremented lawyer duration for ${bookingId}`);

          const videoRoomId = `video-${bookingId}`;
          const clients = io.sockets.adapter.rooms.get(videoRoomId);
          let userPresent = false;

          if (clients) {
            for (const clientId of clients) {
              const clientSocket = io.sockets.sockets.get(clientId);
              if (clientSocket?.data.role === UserRole.USER) {
                userPresent = true;
                break;
              }
            }
          }

          if (userPresent) {
            await this._bookingRepository.incrementCallDuration(bookingId, 10);
          }
        }
      });

      // Redundant heartbeat listener
      socket.on("heartbeat", async ({ bookingId }: VideoJoinPayload) => {
        const role = socket.data.role;
        const userId = socket.data.userId;

        if (bookingId && role === UserRole.LAWYER) {
          await this._bookingRepository.incrementLawyerCallDuration(bookingId, 10);
        }
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

  public sendMessageToRoom(roomId: string, event: string, data: unknown): void {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    }
  }
}