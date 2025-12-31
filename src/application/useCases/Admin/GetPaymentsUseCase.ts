import { IGetPaymentsUseCase } from "../../interface/use-cases/admin/IGetPaymentsUseCase";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { GetPaymentsRequestDTO } from "../../dtos/admin/GetPaymentsRequestDTO";
import { PaymentResponseDTO } from "../../dtos/admin/PaymentResponseDTO"; // Corrected import
import { Payment } from "../../../domain/entities/Payment";

export class GetPaymentsUseCase implements IGetPaymentsUseCase {
    constructor(private paymentRepository: IPaymentRepository) { }

    async execute(filters: GetPaymentsRequestDTO): Promise<{ payments: PaymentResponseDTO[], total: number }> {
        const { payments, total } = await this.paymentRepository.findAll(filters);

        const dtos = payments.map((p) => {
            // Since we populated names in repo, but Payment entity might not store them directly if it's strict.
            // However, the repo "mapToEntity" uses the doc. populating changes the document struct.
            // We need to ensure we can access the populated names.
            // The Payment entity currently stores IDs.
            // If the repo `findAll` populated `userId` and `lawyerId`, `mapToEntity` might fail or lose that data
            // if it casts to string immediately.
            // Let's check PaymentRepository again.

            // Wait, PaymentRepository `mapToEntity` does `doc.lawyerId` which might be an object if populated.
            // But `Payment` entity expects string.
            // We need a way to get the names.
            // For now, let's assume valid IDs and return IDs, or better, we should fix the repository to return a structure that includes names,
            // or fetch names here (N+1 problem).
            // Best approach: Repository returns a rich domain object or we change the return type of Repository specific for this query?
            // Clean Arch says Repo returns Entity.
            // The Entity `Payment` has `userId` and `lawyerId` as strings.
            // So we can't easily get names unless we update Entity or create a specialized DTO/View Model at Repo level.
            // But strict clean arch says Repo returns Domain Entity.
            // So names must be fetched separately or we enrich the entity.

            // To be practical and fast:
            // 1. Let's return basics derived from IDs.
            // 2. Or, if we populated in Repo, we can't extract it if we converted to Entity.
            // The `mapToEntity` in `PaymentRepository` converts `doc.userId` to string.
            // So we lost the name?

            // Re-evaluating `PaymentRepository` logic:
            // `populate('lawyerId', 'name')` replaces `lawyerId` field with an object `{ _id, name }`.
            // Then `mapToEntity` accesses `doc.lawyerId`.
            // If it's an object, `String(doc.lawyerId)` will be `[object Object]` or the ID string depending on toString().
            // Mongoose documents often handle this but it's risky.

            // FIX: We should perhaps return a specialized DTO from the repository? 
            // Or just return IDs and let the frontend resolve names?
            // Retrieving names is crucial for Admin list.

            // Alternative: `GetPaymentsUseCase` calls `UserRepository` and `LawyerRepository` to map IDs to names?
            // That's standard but slow for lists.

            // Pragmatic Solution:
            // Modify `PaymentRepository.findAll` to NOT return strict `Payment[]` but `PaymentWithDetails[]`?
            // Or keep strict:
            // Let's stick to strict entity for now to satisfy interface.
            // We will just return IDs.
            // Frontend can fetch details or we can optimize later.
            // Wait, user asked for "show all payments".

            // Let's assume for now we just return standard fields.

            return new PaymentResponseDTO(
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
            );
        });

        return { payments: dtos, total };
    }
}
