import { Schema } from 'mongoose';

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}

export const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Number, required: true },
    accountNumber: { type: Number, required: false, unique: true, length: 10 },
    accountType: {
      type: String,
      enum: AccountType,
      required: true,
      default: AccountType.SAVINGS,
    },
  },
  { timestamps: true },
);
