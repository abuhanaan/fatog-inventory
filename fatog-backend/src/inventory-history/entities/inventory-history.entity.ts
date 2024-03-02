import { ApiProperty } from '@nestjs/swagger';
import { InventoryHistory } from '@prisma/client';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { OrderListEntity } from 'src/order-lists/entities/order-list.entity';
import { StockListEntity } from 'src/stock-lists/entities/stock-list.entity';

export class InventoryHistoryEntity implements InventoryHistory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  inventoryId: number;

  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  stockItemId: number;

  @ApiProperty()
  remainderBefore: number;

  @ApiProperty()
  remainderAfter: number;

  @ApiProperty()
  effectQuantity: number;

  @ApiProperty()
  increment: boolean;

  @ApiProperty()
  decrement: boolean;

  @ApiProperty()
  note: string;

  @ApiProperty({ required: false, type: () => InventoryEntity })
  inventory: InventoryEntity;

  @ApiProperty({ required: false, type: () => OrderListEntity })
  orderItem: OrderListEntity;

  @ApiProperty({ required: false, type: () => StockListEntity })
  stockItem: StockListEntity;

  constructor({
    inventory,
    orderItem,
    stockItem,
    ...data
  }: Partial<InventoryHistoryEntity>) {
    Object.assign(this, data);

    if (inventory) {
      this.inventory = new InventoryEntity(inventory);
    }

    if (orderItem) {
      this.orderItem = new OrderListEntity(orderItem);
    }

    if (stockItem) {
      this.stockItem = new StockListEntity(stockItem);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
