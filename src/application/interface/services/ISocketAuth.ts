import { Socket } from 'socket.io';

export interface ISocketAuth {
    socketAuth(socket: Socket, next: (err?: Error) => void): void;
}
