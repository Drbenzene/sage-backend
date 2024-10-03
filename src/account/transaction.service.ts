import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './interfaces/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
  ) {}

  /**
   * @param accountData
   * @returns  CREATE ACCOUNT FOR USER
   * @description This method creates an account for a user
   */
  async createTransaction(transactionData: any): Promise<Transaction> {
    const newAccount = new this.transactionModel(transactionData);
    return newAccount.save();
  }
}
