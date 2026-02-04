import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IGetWalletUseCase } from "../../interface/use-cases/user/IGetWalletUseCase";
import { Wallet } from "../../../domain/entities/Wallet";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private readonly _walletRepository: IWalletRepository) { }

    async execute(userId: string): Promise<Wallet> {
        let wallet = await this._walletRepository.findByUserId(userId);

        if (!wallet) {
            wallet = new Wallet(userId, 0, []);
            await this._walletRepository.createWallet(wallet);
        }

        return wallet;
    }
}
