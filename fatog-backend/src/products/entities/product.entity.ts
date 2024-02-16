import { ApiProperty } from '@nestjs/swagger';
import { Product, Manufacturer } from '@prisma/client';
import { ManufacturerEntity } from 'src/manufacturers/entities/manufacturer.entity';

export class ProductEntity implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  manufacturerId: number;

  @ApiProperty({ required: false, type: ManufacturerEntity })
  manufacturer?: ManufacturerEntity;

  //   @ApiProperty({ required: false, type: OrderEntity })
  //   orders?: OrderEntity;

  constructor({ manufacturer, ...data }: Partial<ProductEntity>) {
    Object.assign(this, data);

    if (manufacturer) {
      this.manufacturer = new ManufacturerEntity(manufacturer);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
