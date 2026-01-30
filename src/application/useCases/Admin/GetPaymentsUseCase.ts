import { IGetPaymentsUseCase } from "../../interface/use-cases/admin/IGetPaymentsUseCase";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { GetPaymentsRequestDTO } from "../../dtos/admin/GetPaymentsRequestDTO";
import { PaymentResponseDTO } from "../../dtos/admin/PaymentResponseDTO";

export class GetPaymentsUseCase implements IGetPaymentsUseCase {
    constructor(private _paymentRepository: IPaymentRepository) { }

    async execute(filters: GetPaymentsRequestDTO): Promise<{ payments: PaymentResponseDTO[], total: number }> {
        const { payments, total } = await this._paymentRepository.findAll(filters);

        const dtos = payments.map((p) => new PaymentResponseDTO(
            p.id,
            p.lawyerName || p.lawyerId,
            p.userName || p.userId || 'N/A',
            p.amount,
            p.currency,
            p.status,
            p.type || 'booking',
            p.transactionId,
            p.createdAt,
            p.paymentMethod
        ));

        return { payments: dtos, total };
    }
}
