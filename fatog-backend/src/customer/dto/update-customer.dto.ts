import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { Exclude } from 'class-transformer';

// export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
//   @Exclude()
//   @ApiHideProperty()
//   customerId?: number;
// }

export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ['customerId']),
) {
  @Exclude()
  @ApiHideProperty()
  customerId?: number;
}
