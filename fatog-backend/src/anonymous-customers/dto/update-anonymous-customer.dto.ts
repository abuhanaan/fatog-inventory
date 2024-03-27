import { PartialType } from '@nestjs/swagger';
import { CreateAnonymousCustomerDto } from './create-anonymous-customer.dto';

export class UpdateAnonymousCustomerDto extends PartialType(CreateAnonymousCustomerDto) {}
