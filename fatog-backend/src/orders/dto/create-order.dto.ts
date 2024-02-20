import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalAmount: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalWeight: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalNoOfBags: number;

  @IsNumber()
  @ApiProperty()
  customerId?: number;

  @IsNumber()
  @ApiProperty()
  staffId?: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  shippingAddress?: string;

  @IsString()
  @ApiProperty()
  paymentStatus?: string;

  @IsString()
  @ApiProperty()
  deliveryStatus?: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  amountPaid?: number;

  @IsNumber()
  @ApiProperty()
  outStandingPayment?: number;

  @IsString()
  @ApiProperty()
  note?: string;
}
