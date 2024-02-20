import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderListDto {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  noOfBags: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  pricePerBag: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalWeight: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalPrice: number;
}
