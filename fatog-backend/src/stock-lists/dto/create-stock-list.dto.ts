import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockListDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  stockId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  noOfBags: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pricePerBag: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  totalWeight: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  totalAmount: number;
}
