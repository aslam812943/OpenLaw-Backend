import { Wallet, WalletTransaction } from "../../../domain/entities/Wallet";
import { ResponseGetWalletDTO, WalletTransactionDTO } from "../../dtos/user/ResponseGetWalletDTO";

export class WalletMapper {
    static toDTO(balance: number, transactions: WalletTransaction[], total: number): ResponseGetWalletDTO {
        const transactionDTOs = transactions.map(t => new WalletTransactionDTO(
            t.type,
            t.amount,
            t.date,
            t.status,
            t.bookingId,
            t.description,
            t.metadata
        ));

        return new ResponseGetWalletDTO(balance, transactionDTOs, total);
    }
}
