import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { PaymentModel, IPaymentDocument } from "../db/models/admin/PaymentModel";

export class PaymentRepository implements IPaymentRepository {
    async create(payment: Partial<Payment>): Promise<Payment> {
        const newPayment = await PaymentModel.create(payment);
        return this.mapToEntity(newPayment);
    }

    async findById(id: string): Promise<Payment | null> {
        const payment = await PaymentModel.findById(id);
        return payment ? this.mapToEntity(payment) : null;
    }

    async findByBookingId(bookingId: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ bookingId });
        return payment ? this.mapToEntity(payment) : null;
    }

    async findByTransactionId(transactionId: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ transactionId });
        return payment ? this.mapToEntity(payment) : null;
    }

    async findAll(filters?: any): Promise<{ payments: Payment[]; total: number }> {
        const query: any = {};

        if (filters?.search) {
            query.$or = [
                { transactionId: { $regex: filters.search, $options: 'i' } }
            ];
        }

        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }

        if (filters?.type && filters.type !== 'all') {
            query.type = filters.type;
        }

        if (filters?.startDate && filters?.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            PaymentModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('lawyerId', 'name')
                .populate('userId', 'name'),
            PaymentModel.countDocuments(query)
        ]);

        return {
            payments: payments.map(p => this.mapToEntity(p)),
            total
        };
    }

    private mapToEntity(doc: IPaymentDocument): Payment {
        return new Payment(
            doc._id as string,
            doc.userId ? (typeof doc.userId === 'object' && 'name' in doc.userId ? (doc.userId as any)._id.toString() : String(doc.userId)) : '',
            typeof doc.lawyerId === 'object' && 'name' in doc.lawyerId ? (doc.lawyerId as any)._id.toString() : String(doc.lawyerId),
            doc.amount,
            doc.currency,
            doc.status as 'pending' | 'completed' | 'failed' | 'refunded',
            doc.transactionId,
            doc.paymentMethod,
            (doc as any).createdAt,
            (doc as any).updatedAt,
            doc.bookingId ? String(doc.bookingId) : undefined,
            doc.subscriptionId ? String(doc.subscriptionId) : undefined,
            doc.type as 'booking' | 'subscription' | undefined,
            typeof doc.lawyerId === 'object' && 'name' in doc.lawyerId ? (doc.lawyerId as any).name : undefined,
            doc.userId && typeof doc.userId === 'object' && 'name' in doc.userId ? (doc.userId as any).name : undefined
        );
    }
}
