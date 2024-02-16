import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
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
  @IsNotEmpty()
  @ApiProperty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  manufacturerId: number;
}
