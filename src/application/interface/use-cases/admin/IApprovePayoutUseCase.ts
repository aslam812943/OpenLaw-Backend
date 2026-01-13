export interface IApprovePayoutUseCase {
    execute(withdrawalId: string): Promise<void>;
}
