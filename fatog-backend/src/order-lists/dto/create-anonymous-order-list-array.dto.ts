import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderListArrayDto } from './create-order-list-array.dto';
import { IsString } from 'class-validator';

export class CreateAnonymousOrderListArrayDto extends PartialType(
  CreateOrderListArrayDto,
) {
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsString()
  @ApiProperty({ required: false })
  gender?: string;
}
