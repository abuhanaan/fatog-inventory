import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { ManufacturerEntity } from 'src/manufacturers/entities/manufacturer.entity';
import { OrderListEntity } from 'src/order-lists/entities/order-list.entity';
import { StockListEntity } from 'src/stock-lists/entities/stock-list.entity';

export class ProductEntity implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  refId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  pricePerBag: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  manufacturerId: number;

  @ApiProperty({ required: false, type: () => ManufacturerEntity })
  manufacturer?: ManufacturerEntity;

  @ApiProperty({ required: false, type: () => OrderListEntity, isArray: true })
  orderItems?: OrderListEntity[];

  @ApiProperty({ required: false, type: () => StockListEntity, isArray: true })
  stockItems?: StockListEntity[];

  @ApiProperty({ required: false, type: () => InventoryEntity })
  invetory?: InventoryEntity;

  constructor({
    manufacturer,
    orderItems,
    stockItems,
    invetory,
    ...data
  }: Partial<ProductEntity>) {
    Object.assign(this, data);

    if (manufacturer) {
      this.manufacturer = new ManufacturerEntity(manufacturer);
    }

    if (orderItems) {
      this.orderItems = orderItems.map(
        (orderItem) => new OrderListEntity(orderItem),
      );
    }

    if (stockItems) {
      this.stockItems = stockItems.map(
        (stockItem) => new StockListEntity(stockItem),
      );
    }

    if (invetory) {
      this.invetory = new InventoryEntity(invetory);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
