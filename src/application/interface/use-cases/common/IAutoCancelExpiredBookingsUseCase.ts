export interface IAutoCancelExpiredBookingsUseCase {
    execute(): Promise<void>;
}
