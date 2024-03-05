import { ApiProperty } from '@nestjs/swagger';
import { Inventory } from '@prisma/client';
import { InventoryHistoryEntity } from 'src/inventory-history/entities/inventory-history.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

export class InventoryEntity implements Inventory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productRefId: string;

  @ApiProperty()
  remainingQty: number;

  @ApiProperty({ required: false, type: () => ProductEntity })
  product?: ProductEntity;

  @ApiProperty({
    required: false,
    type: () => InventoryHistoryEntity,
    isArray: true,
  })
  history?: InventoryHistoryEntity[];

  constructor({ product, history, ...data }: Partial<InventoryEntity>) {
    Object.assign(this, data);

    if (product) {
      this.product = new ProductEntity(product);
    }

    if (history) {
      this.history = history.map(
        (historyItem) => new InventoryHistoryEntity(historyItem),
      );
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
