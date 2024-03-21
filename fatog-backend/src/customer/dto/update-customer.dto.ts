import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { Exclude } from 'class-transformer';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @Exclude()
  @ApiHideProperty()
  customerId?: number;
}
