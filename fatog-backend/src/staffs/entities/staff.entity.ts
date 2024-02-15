import { ApiProperty } from '@nestjs/swagger';
import { Staff } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class StaffEntity implements Staff {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  staffId: number | null;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  //   @ApiProperty({ required: false, type: OrderEntity })
  //   sales?: SalesEntity;

  constructor({
    // sales,
    user,
    ...data
  }: Partial<StaffEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
