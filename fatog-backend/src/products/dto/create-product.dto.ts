import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  id: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  weight: number;

  @IsNumber()
  @ApiProperty()
  pricePerBag?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  manufacturerId: number;
}
