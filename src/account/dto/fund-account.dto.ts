import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class FundAccountDto {
  @ApiProperty({
    description: 'The amount to be added to the account',
    example: 1000,
  })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}
