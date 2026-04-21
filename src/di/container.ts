import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { ChatRoomRepository } from "../infrastructure/repositories/ChatRoomRepository";
import { SendMessageUseCase } from "../application/useCases/common/chat/SendMessageUseCase";
import { MarkMessagesAsReadUseCase } from "../application/useCases/common/chat/MarkMessagesAsReadUseCase";
import { SocketAuthService } from "../infrastructure/services/socket/socketAuth";
import { SocketServerService } from "../infrastructure/services/socket/socketServer";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { SendNotificationUseCase } from "../application/useCases/common/notification/SendNotificationUseCase";
import { GetNotificationsUseCase } from "../application/useCases/common/notification/GetNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../application/useCases/common/notification/MarkNotificationAsReadUseCase";
import { NotificationController } from "../interface/controllers/common/notification/NotificationController";
import { BookingRepository } from "../infrastructure/repositories/user/BookingRepository";
import { EndCallUseCase } from "../application/useCases/common/videoCall/EndCallUseCase";

const messageRepository = new MessageRepository();
const chatRoomRepository = new ChatRoomRepository();
const bookingRepository = new BookingRepository();

const sendMessageUseCase = new SendMessageUseCase(messageRepository, chatRoomRepository, bookingRepository);
const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(messageRepository);
const socketAuthService = new SocketAuthService();
const endCallUseCase = new EndCallUseCase(bookingRepository);

export const socketServerService = new SocketServerService(
    sendMessageUseCase,
    markMessagesAsReadUseCase,
    socketAuthService,
    bookingRepository,
    chatRoomRepository,
    endCallUseCase
);

// Notifications
const notificationRepository = new NotificationRepository();
export const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository, socketServerService);
export const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);

export const notificationController = new NotificationController(
    getNotificationsUseCase,
    markNotificationAsReadUseCase
);
