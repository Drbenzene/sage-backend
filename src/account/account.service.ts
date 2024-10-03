import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './interfaces/account.interface';
import * as uniqid from 'uniqid';
import { TransactionType } from 'src/database/schemas/transaction.schema';
import { TransactionService } from './transaction.service';
import { Transaction } from './interfaces/transaction.interface';
import { TransferAccountDto } from './dto/transfer-acccount.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private transactionService: TransactionService,
  ) {}

  /**
   * @param accountData
   * @returns  CREATE ACCOUNT FOR USER
   * @description This method creates an account for a user
   */
  async createAccount(accountData: any): Promise<Account> {
    //GENERATE ACCOUNT NUMBER 10 DIGIT
    accountData.accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000,
    );
    const newAccount = new this.accountModel(accountData);
    return newAccount.save();
  }

  async fundAccount(userId: string, amount: number): Promise<Transaction> {
    let account = await this.accountModel.findOne({ userId });
    if (!account) {
      throw new BadRequestException(
        'Account number not found. Please check and try again.',
      );
    }
    account.balance += amount;
    await account.save();

    const reference = `CRD-${uniqid()}`;
    const transactionData = {
      userId,
      amount,
      reference,
      transactionType: TransactionType.CREDIT,
      balanceBefore: account.balance - amount,
      balanceAfter: account.balance,
      description: `TRANSFER IN - ${reference}`,
    };

    return await this.transactionService.createTransaction(transactionData);
  }

  async withdrawFund(userId: string, amount: number): Promise<Transaction> {
    let account = await this.accountModel.findOne({ userId });
    if (!account) {
      throw new BadRequestException(
        'Account number not found. Please check and try again.',
      );
    }
    account.balance -= amount;
    await account.save();

    const reference = `DBT-${uniqid()}`;
    const transactionData = {
      userId,
      amount,
      reference,
      transactionType: TransactionType.DEBIT,
      balanceBefore: account.balance,
      balanceAfter: account.balance - amount,
      description: `TRANSFER OUT - ${reference}`,
    };
    return await this.transactionService.createTransaction(transactionData);
  }

  async transferFund(
    transferData: TransferAccountDto,
    userId: string,
  ): Promise<any> {
    const { accountNumber, amount } = transferData;
    let receiverAccount = await this.accountModel.findOne({ accountNumber });
    if (!receiverAccount) {
      throw new BadRequestException(
        `Recipient account doesn't exist. Please check and try again.`,
      );
    }

    const senderAccount = await this.accountModel.findOne({ userId });
    if (senderAccount.accountNumber === accountNumber) {
      throw new UnprocessableEntityException(`You can't transfer to yourself`);
    }
    if (senderAccount.balance < amount) {
      throw new UnprocessableEntityException(`Insufficient balance`);
    }

    //DEBIT THE SENDER
    const debitRes = await this.withdrawFund(userId, amount);
    //CREDIT THE RECEIVER
    await this.fundAccount(receiverAccount.userId as string, amount);

    return debitRes;
  }
}
