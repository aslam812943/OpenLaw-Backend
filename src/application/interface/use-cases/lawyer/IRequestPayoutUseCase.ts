import { Withdrawal } from "../../../../domain/entities/Withdrawal";

export interface IRequestPayoutUseCase {
    execute(lawyerId: string, amount: number): Promise<Withdrawal>;
}
