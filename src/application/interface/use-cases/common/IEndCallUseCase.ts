export interface IEndCallUseCase {
    execute(bookingId: string): Promise<void>;
}
