import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderListDto } from './create-order-list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderListArrayDto {
  @IsArray()
  @ApiProperty({ type: CreateOrderListDto, isArray: true })
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

  paymentStatus?: string;

  deliveryStatus?: string;

  @IsNumber()
  @ApiProperty({ required: false })
  amountPaid?: number;

  outStandingPayment?: number;

  @IsString()
  @ApiProperty({ required: false })
  note?: string;
}
