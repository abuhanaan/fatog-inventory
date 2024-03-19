import { ApiProperty } from '@nestjs/swagger';
import { PaymentHistory } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { SalesEntity } from 'src/sales/entities/sale.entity';

export class PaymentEntity implements PaymentHistory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  salesId: number;

  @ApiProperty()
  outstandingBefore: number;

  @ApiProperty()
  prevPaymentSum: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  outstandingAfter: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, type: () => OrderEntity })
  order?: OrderEntity;

  @ApiProperty({ required: false, type: () => SalesEntity })
  sales?: SalesEntity;

  constructor({ order, sales, ...data }: Partial<PaymentEntity>) {
    Object.assign(this, data);

    if (order) {
      this.order = new OrderEntity(order);
    }

    if (sales) {
      this.sales = new SalesEntity(sales);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
