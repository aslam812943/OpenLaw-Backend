import { ResponseGetWalletDTO } from "../../../dtos/user/ResponseGetWalletDTO";

export interface IGetWalletUseCase {
    execute(userId: string, page: number, limit: number): Promise<ResponseGetWalletDTO>;
}
