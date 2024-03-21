import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateStaffDto } from './create-staff.dto';
import { Exclude } from 'class-transformer';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @Exclude()
  @ApiHideProperty()
  staffId?: number;
}
