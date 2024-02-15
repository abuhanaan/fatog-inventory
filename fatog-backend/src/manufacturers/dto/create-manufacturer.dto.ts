import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  repName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  repPhoneNumber: string;
}
