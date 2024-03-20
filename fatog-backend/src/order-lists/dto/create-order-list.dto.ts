import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderListDto {
  orderRefId?: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  productRefId: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  noOfBags: number;

  pricePerBag?: number;

  @ApiProperty({ default: 0, required: false })
  totalWeight?: number;

  @ApiProperty({ default: 0, required: false })
  totalAmount?: number;
}
