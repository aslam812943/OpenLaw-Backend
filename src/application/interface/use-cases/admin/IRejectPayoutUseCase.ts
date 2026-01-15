export interface IRejectPayoutUseCase {
    execute(withdrawalId: string): Promise<void>;
}
