export class Message {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly senderId: string,
    public readonly senderRole: "user" | "lawyer",
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly type: "text" | "image" | "video" | "document" = "text",
    public readonly fileUrl?: string,
    public readonly fileName?: string,
    public readonly fileSize?: string,
    public readonly readAt?: Date | null
  ) { }
}
