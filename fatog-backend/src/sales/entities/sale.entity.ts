import { ApiProperty } from '@nestjs/swagger';
import { Sales } from '@prisma/client';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { PaymentEntity } from 'src/payments/entities/payment.entity';
import { StaffEntity } from 'src/staffs/entities/staff.entity';

export class SalesEntity implements Sales {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderRefId: string;

  @ApiProperty()
  amountPayable: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  outStandingPayment: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  cashierId: number;

  @ApiProperty({ required: false, type: () => OrderEntity })
  order?: OrderEntity;

  @ApiProperty({ required: false, type: () => StaffEntity })
  staff?: StaffEntity;

  @ApiProperty({ required: false, type: () => PaymentEntity, isArray: true })
  payments?: PaymentEntity[];

  constructor({ order, staff, payments, ...data }: Partial<SalesEntity>) {
    Object.assign(this, data);

    if (order) {
      this.order = new OrderEntity(order);
    }

    if (staff) {
      this.staff = new StaffEntity(staff);
    }

    if (payments) {
      this.payments = payments.map((payment) => new PaymentEntity(payment));
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
