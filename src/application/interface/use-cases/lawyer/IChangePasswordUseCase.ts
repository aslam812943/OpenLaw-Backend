export interface IChangePasswordUseCase {
    execute(lawyerId: string, oldPassword: string, newPassword: string): Promise<{ message: string }>;
}
