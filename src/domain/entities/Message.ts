export class Message {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly senderId: string,
    public readonly senderRole: "user" | "lawyer",
    public readonly content: string,
    public readonly createdAt: Date 
  ) {}
}
