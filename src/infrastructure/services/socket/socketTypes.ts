export interface JoinRoomPayload {
    roomId: string;
}

export interface SendMessagePayload {
    roomId: string;
    content: string
}

export interface JwtPayload {
    id: string;
    role: 'user' | 'lawyer';
}