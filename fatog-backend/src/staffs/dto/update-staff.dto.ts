import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStaffDto } from './create-staff.dto';
import { Exclude } from 'class-transformer';

// export class UpdateStaffDto extends PartialType(CreateStaffDto) {
//   @Exclude()
//   @ApiHideProperty()
//   staffId?: number;
// }

export class UpdateStaffDto extends PartialType(
  OmitType(CreateStaffDto, ['staffId']),
) {
  @Exclude()
  @ApiHideProperty()
  staffId?: number;
}
