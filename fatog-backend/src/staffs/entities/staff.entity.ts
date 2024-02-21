import { ApiProperty } from '@nestjs/swagger';
import { Staff } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class StaffEntity implements Staff {
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
  staffId: number | null;

  @ApiProperty({ required: false, type: () => UserEntity })
  user?: UserEntity;

  //   @ApiProperty({ required: false, type: SalesEntity })
  //   sales?: SalesEntity;

  @ApiProperty({ required: false, type: () => OrderEntity, isArray: true })
  orders?: OrderEntity[];

  @ApiProperty({ required: false, type: () => StockEntity, isArray: true })
  stocks?: StockEntity[];

  constructor({
    // sales,
    stocks,
    orders,
    user,
    ...data
  }: Partial<StaffEntity>) {
    Object.assign(this, data);

    if (stocks) {
      this.stocks = stocks.map((stock) => new StockEntity(stock));
    }

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
