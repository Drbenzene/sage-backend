import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { UseGuards } from '@nestjs/common';
import { FundAccountDto } from './dto/fund-account.dto';
import { CurrentUser } from 'src/user/current-user.decorator';
import { User } from 'src/user/interfaces/user.interface';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';
import { TransferAccountDto } from './dto/transfer-acccount.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Fund Account' })
  @ApiBody({ type: FundAccountDto })
  @Post('fund')
  fundAccount(
    @Body() fundAccountDto: FundAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.accountService.fundAccount(user.id, fundAccountDto.amount);
  }

  @ApiOperation({ summary: 'Withdraw from Account' })
  @ApiBody({ type: WithdrawAccountDto })
  @Post('withdraw')
  withdrawAccount(
    @Body() withdrawDto: WithdrawAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.accountService.withdrawFund(user.id, withdrawDto.amount);
  }

  @ApiOperation({
    summary: 'Transfer from Account to a recipient account number',
  })
  @ApiBody({ type: TransferAccountDto })
  @Post('transfer')
  transferFunds(
    @Body() trasferDto: TransferAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.accountService.transferFund(trasferDto, user.id);
  }
}
