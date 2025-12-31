import { GetPaymentsRequestDTO } from "../../../dtos/admin/GetPaymentsRequestDTO";
import { PaymentResponseDTO } from "../../../dtos/admin/PaymentResponseDTO";

export interface IGetPaymentsUseCase {
    execute(filters: GetPaymentsRequestDTO): Promise<{ payments: PaymentResponseDTO[], total: number }>;
}
