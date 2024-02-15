import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shippingAddress?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  customerId?: number;
}
