import { Server } from 'socket.io';

export interface ISocketServer {
    setupSocketServer(io: Server): void;
}
