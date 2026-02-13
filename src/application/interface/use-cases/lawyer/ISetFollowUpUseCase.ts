export interface ISetFollowUpUseCase {
    execute(appointmentId: string, followUpType: 'none' | 'specific' | 'deadline', followUpDate?: string, followUpTime?: string, feedback?: string): Promise<void>;
}
