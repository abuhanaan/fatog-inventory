import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  inventoryId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  orderItemId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  stockItemId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  remainderBefore: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  remainderAfter: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  effectQuantity: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  increment: Boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  decrement: Boolean;
}
