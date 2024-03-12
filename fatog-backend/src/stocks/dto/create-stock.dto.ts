import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  @ApiProperty()
  totalAmount: number;

  @IsString()
  @ApiProperty()
  refId: string;

  @IsNumber()
  @ApiProperty()
  totalWeight: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  totalNoOfBags: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  staffId: number;

  @IsString()
  @ApiProperty()
  invoice?: string;
}
