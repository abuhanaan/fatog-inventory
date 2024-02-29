import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amountPayable: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amountPaid: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  paymentStatus: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  outStandingPayment: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  note: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cashierId: number;
}
