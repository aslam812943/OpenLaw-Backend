export interface ICancelFollowUpUseCase {
    execute(appointmentId: string): Promise<void>;
}
