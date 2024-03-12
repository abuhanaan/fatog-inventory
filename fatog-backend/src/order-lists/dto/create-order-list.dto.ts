import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderListDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  orderRefId?: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  productRefId: string;

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
  totalWeight?: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  totalPrice?: number;
}
