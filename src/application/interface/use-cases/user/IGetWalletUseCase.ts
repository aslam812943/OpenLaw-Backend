import { Wallet } from "../../../../domain/entities/Wallet";

export interface IGetWalletUseCase {
    execute(userId: string): Promise<Wallet>;
}
