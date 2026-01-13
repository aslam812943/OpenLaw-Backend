import { UserRole } from "../../interface/enums/UserRole";

export interface JoinRoomPayload {
    roomId: string;
}

export interface SendMessagePayload {
    roomId: string;
    content: string;
    type?: "text" | "image" | "video" | "document";
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
}

export interface MarkReadPayload {
    roomId: string;
}

export interface JwtPayload {
    id: string;
    role: UserRole;
}

export interface VideoJoinPayload {
    bookingId: string;
}

export interface VideoSignalPayload {
    bookingId: string;
    signal: any;
}