export interface IReportNoShowUseCase {
    execute(bookingId: string): Promise<void>;
}
