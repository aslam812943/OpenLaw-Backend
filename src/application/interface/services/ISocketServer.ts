import { Server } from 'socket.io';

export interface ISocketServer {
    setupSocketServer(io: Server): void;
    sendNotification(userId: string, data: string): void;
    handleLogout(userId: string): void;
    sendMessageToRoom(roomId: string, event: string, data: any): void;
}
