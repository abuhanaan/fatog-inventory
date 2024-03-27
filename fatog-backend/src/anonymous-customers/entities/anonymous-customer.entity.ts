import { ApiProperty } from '@nestjs/swagger';
import { AnonymousCustomer } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';

export class AnonymousCustomerEntity implements AnonymousCustomer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  gender: string;

  @ApiProperty({ required: false, type: () => OrderEntity, isArray: true })
  orders?: OrderEntity[];

  constructor({ orders, ...data }: Partial<AnonymousCustomerEntity>) {
    Object.assign(this, data);

    if (orders) {
      this.orders = orders.map((order) => new OrderEntity(order));
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
