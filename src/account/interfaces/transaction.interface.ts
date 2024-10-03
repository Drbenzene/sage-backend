import { Document } from 'mongoose';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export interface Transaction extends Document {
  readonly userId: string;
  readonly amount: number;
  readonly transactionType: TransactionType;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly description: string;
  readonly reference: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
