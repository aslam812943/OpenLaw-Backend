export interface IToggleSubscriptionStatusUseCase {
    execute(id: string, status: boolean): Promise<void>;
}
