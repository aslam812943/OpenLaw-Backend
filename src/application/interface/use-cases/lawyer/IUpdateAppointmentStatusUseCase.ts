export interface IUpdateAppointmentStatusUseCase {
    execute(appointmentId: string, status: string): Promise<void>;
}
