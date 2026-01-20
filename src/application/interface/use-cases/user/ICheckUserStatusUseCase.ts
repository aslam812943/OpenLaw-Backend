export interface ICheckUserStatusUseCase {
    check(userId: string): Promise<{ isActive: boolean }>;
}
