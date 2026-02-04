import mongoose, { Schema, Document } from "mongoose";


export interface IWalletDocument extends Document {
    userId: mongoose.Types.ObjectId;
    balance: number;
    transactions: ITransactions[]
}


export interface ITransactions {
    type: 'credit' | 'debit';
    amount: number;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
    bookingId?: mongoose.Types.ObjectId;
    description?: string;
    metadata?: {
        reason?: string;
        lawyerName?: string;
        lawyerId?: string;
        date?: string;
        time?: string;
        displayId?: string;
    };
}

const TransactionSchema = new Schema<ITransactions>({
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: "pending" },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    description: { type: String },
    metadata: {
        reason: { type: String },
        lawyerName: { type: String },
        lawyerId: { type: String },
        date: { type: String },
        time: { type: String },
        displayId: { type: String }
    }
})


const WalletSchema = new Schema<IWalletDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [TransactionSchema]
}, { timestamps: true })


export const WalletModel = mongoose.model<IWalletDocument>("Wallet", WalletSchema)