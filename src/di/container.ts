import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { ChatRoomRepository } from "../infrastructure/repositories/ChatRoomRepository";
import { SendMessageUseCase } from "../application/useCases/common/chat/SendMessageUseCase";
import { MarkMessagesAsReadUseCase } from "../application/useCases/common/chat/MarkMessagesAsReadUseCase";
import { SocketAuthService } from "../infrastructure/services/socket/socketAuth";
import { SocketServerService } from "../infrastructure/services/socket/socketServer";

const messageRepository = new MessageRepository();
const chatRoomRepository = new ChatRoomRepository();
const sendMessageUseCase = new SendMessageUseCase(messageRepository, chatRoomRepository);
const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(messageRepository);
const socketAuthService = new SocketAuthService();

export const socketServerService = new SocketServerService(
    sendMessageUseCase,
    markMessagesAsReadUseCase,
    socketAuthService
);
