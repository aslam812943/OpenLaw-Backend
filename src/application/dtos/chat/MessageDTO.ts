export class MessageDTO {
    constructor(
        public id: string,
        public roomId: string,
        public senderId: string,
        public senderRole: "user" | "lawyer",
        public content: string,
        public createdAt: Date,
        public type: "text" | "image" | "video" | "document",
        public fileUrl?: string,
        public fileName?: string,
        public fileSize?: string,
        public readAt?: Date | null
    ) { }
}
