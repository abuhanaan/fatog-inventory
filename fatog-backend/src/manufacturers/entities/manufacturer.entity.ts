import { ApiProperty } from '@nestjs/swagger';
import { Manufacturer } from '@prisma/client';
import { ProductEntity } from 'src/products/entities/product.entity';

export class ManufacturerEntity implements Manufacturer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  brandName: string;

  @ApiProperty()
  repName: string;

  @ApiProperty()
  repPhoneNumber: string;

  @ApiProperty({ required: false, isArray: true, type: () => ProductEntity })
  products?: ProductEntity[];

  constructor({ products, ...data }: Partial<ManufacturerEntity>) {
    Object.assign(this, data);

    if (products) {
      this.products = products.map((product) => new ProductEntity(product));
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
