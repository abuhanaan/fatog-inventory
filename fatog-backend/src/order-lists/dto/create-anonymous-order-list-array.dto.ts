import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderListArrayDto } from './create-order-list-array.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnonymousOrderListArrayDto extends PartialType(
  CreateOrderListArrayDto,
) {
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
}
