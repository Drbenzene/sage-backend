import { Global, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/database/schemas/accout.schema';
import { TransactioSchema } from 'src/database/schemas/transaction.schema';
import { TransactionService } from './transaction.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'Transaction', schema: TransactioSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService, TransactionService],
  exports: [AccountService, TransactionService],
})
export class AccountModule {}
