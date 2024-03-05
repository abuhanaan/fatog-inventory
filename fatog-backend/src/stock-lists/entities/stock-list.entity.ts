import { ApiProperty } from '@nestjs/swagger';
import { StockList } from '@prisma/client';
import { InventoryHistoryEntity } from 'src/inventory-history/entities/inventory-history.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';

export class StockListEntity implements StockList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  stockId: number;

  @ApiProperty()
  productRefId: string;

  @ApiProperty()
  noOfBags: number;

  @ApiProperty()
  pricePerBag: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty({ required: false, type: () => ProductEntity })
  product?: ProductEntity;

  @ApiProperty({ required: false, type: () => StockEntity })
  stock?: StockEntity;

  @ApiProperty({ required: false, type: () => InventoryHistoryEntity })
  inventory?: InventoryHistoryEntity;

  constructor({
    product,
    stock,
    inventory,
    ...data
  }: Partial<StockListEntity>) {
    Object.assign(this, data);

    if (product) {
      this.product = new ProductEntity(product);
    }

    if (stock) {
      this.stock = new StockEntity(stock);
    }

    if (inventory) {
      this.inventory = new InventoryHistoryEntity(inventory);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
