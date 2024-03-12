import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockListDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  productRefId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  noOfBags: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  pricePerBag: number;

  @ApiProperty({ required: false })
  totalWeight?: number;

  @ApiProperty({ required: false })
  totalAmount?: number;
}
