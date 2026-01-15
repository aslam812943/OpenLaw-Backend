export interface IUpdateAppointmentStatusUseCase {
    execute(appointmentId: string, status: string, feedback?: string): Promise<void>;
}
