export class MessageDTO {
    constructor(
        public id: string,
        public roomId: string,
        public senderId: string,
        public senderRole: "user" | "lawyer",
        public content: string,
        public createdAt: Date
    ) { }
}
