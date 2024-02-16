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

  //   TODO: make maufatorer return associated Products

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;

  constructor(manufacturer: Manufacturer) {
    this.id = manufacturer.id;
    this.brandName = manufacturer.brandName;
    this.repName = manufacturer.repName;
    this.repPhoneNumber = manufacturer.repPhoneNumber;
    this.createdAt = manufacturer.createdAt;
    this.updatedAt = manufacturer.updatedAt;
  }
}
