import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  productRefId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  remainingQty: number;
}
