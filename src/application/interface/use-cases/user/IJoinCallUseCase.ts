export interface IJoinCallUseCase {
    execute(bookingId: string): Promise<void>;
}
