export interface IMarkMessagesAsReadUseCase {
    execute(roomId: string, userId: string): Promise<void>;
}
