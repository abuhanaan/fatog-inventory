import { ApiProperty } from '@nestjs/swagger';
import { Manufacturer } from '@prisma/client';

export class ManufacturerEntity implements Manufacturer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  brandName: string;

  @ApiProperty()
  repName: string;

  @ApiProperty()
  repPhoneNumber: string;

  //   TODO: make maufatorer render Products

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
