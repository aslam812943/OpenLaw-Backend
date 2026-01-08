import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './socketTypes';
import { ISocketAuth } from '../../../application/interface/services/ISocketAuth';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export class SocketAuthService implements ISocketAuth {
    public socketAuth(socket: Socket, next: (err?: Error) => void): void {
        try {
            let token = socket.handshake.auth?.token;

            if (!token) {
                const cookieHeader = socket.handshake.headers.cookie;
                if (cookieHeader) {
                    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                        const [key, value] = cookie.trim().split('=');
                        acc[key] = value;
                        return acc;
                    }, {} as Record<string, string>);

                    token = cookies['accessToken'];
                }
            }

            if (!token) {
                return next(new UnauthorizedError('Authentication error: Token missing'));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as JwtPayload;

            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;

            next();
        } catch (error) {
            next(new UnauthorizedError('Authentication error: Invalid token'));
        }
    }
}