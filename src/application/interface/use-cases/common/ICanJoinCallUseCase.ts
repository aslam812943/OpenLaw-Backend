export interface ICanJoinCallUseCase {
    execute(bookingId: string, userId: string, role: 'user' | 'lawyer'): Promise<{ canJoin: boolean; message: string }>;
}
