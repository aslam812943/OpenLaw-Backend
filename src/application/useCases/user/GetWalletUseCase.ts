import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { IGetWalletUseCase } from "../../interface/use-cases/user/IGetWalletUseCase";
import { Wallet } from "../../../domain/entities/Wallet";
import { ResponseGetWalletDTO } from "../../dtos/user/ResponseGetWalletDTO";
import { WalletMapper } from "../../mapper/user/WalletMapper";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private readonly _walletRepository: IWalletRepository) { }

    async execute(userId: string, page: number, limit: number): Promise<ResponseGetWalletDTO> {
        const wallet = await this._walletRepository.findByUserId(userId);

        if (!wallet) {
            const newWallet = new Wallet(userId, 0, []);
            await this._walletRepository.createWallet(newWallet);
            return WalletMapper.toDTO(0, [], 0);
        }

        const paginatedData = await this._walletRepository.getPaginatedTransactions(userId, page, limit);

        return WalletMapper.toDTO(paginatedData.balance, paginatedData.transactions, paginatedData.total);
    }
}
