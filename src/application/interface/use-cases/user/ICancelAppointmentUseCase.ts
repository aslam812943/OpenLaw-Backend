export interface ICancelAppointmentUseCase {
    execute(bookingId: string, reason: string): Promise<void>;
}
