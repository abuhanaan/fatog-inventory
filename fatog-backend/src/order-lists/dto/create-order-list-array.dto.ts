import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderListDto } from './create-order-list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderListArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderListDto)
  data: CreateOrderListDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shippingAddress?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentStatus?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deliveryStatus?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  amountPaid?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  outStandingPayment?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  note?: string;
}
