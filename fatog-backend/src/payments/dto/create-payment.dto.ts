import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  salesId: number;

  outstandingBefore: number;

  prevPaymentSum: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amountPaid: number;

  outstandingAfter: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  date: Date;
}
