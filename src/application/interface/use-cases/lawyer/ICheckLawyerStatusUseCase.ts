export interface ICheckLawyerStatusUseCase {
    check(id: string): Promise<{ isActive: boolean; verificationStatus?: string; isAdminVerified?: boolean }>;
}
