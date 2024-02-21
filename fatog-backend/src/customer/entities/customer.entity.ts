import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CustomerEntity implements Customer {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  customerId: number | null;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  @ApiProperty({ required: false, type: () => OrderEntity, isArray: true })
  orders?: OrderEntity[];

  constructor({ orders, user, ...data }: Partial<CustomerEntity>) {
    Object.assign(this, data);

    if (orders) {
      this.orders = orders.map((order) => new OrderEntity(order));
    }

    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
