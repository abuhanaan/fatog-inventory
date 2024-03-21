import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  gender?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  staffId: number;
}
