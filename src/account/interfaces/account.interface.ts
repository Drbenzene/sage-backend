import { Document } from 'mongoose';

export interface Account extends Document {
  readonly accountName: string;
  readonly userId: string;
  balance: number;
  accountType: string;
  accountNumber: number;
}
