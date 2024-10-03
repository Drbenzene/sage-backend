import { Schema } from 'mongoose';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export const TransactioSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: TransactionType,
      required: true,
    },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, required: true },
    reference: { type: String, required: true },
  },
  { timestamps: true },
);
