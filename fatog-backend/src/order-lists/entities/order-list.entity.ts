import { ApiProperty } from '@nestjs/swagger';
import { OrderList } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

export class OrderListEntity implements OrderList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  noOfBags: number;

  @ApiProperty()
  pricePerBag: number;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ required: false, type: OrderEntity })
  order?: OrderEntity;

  @ApiProperty({ required: false, type: ProductEntity })
  product?: ProductEntity;

  constructor({ order, product, ...data }: Partial<OrderListEntity>) {
    Object.assign(this, data);

    if (order) {
      this.order = new OrderEntity(order);
    }

    if (product) {
      this.product = new ProductEntity(product);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
