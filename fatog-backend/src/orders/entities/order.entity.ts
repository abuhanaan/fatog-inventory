import { ApiProperty } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { OrderListEntity } from 'src/order-lists/entities/order-list.entity';
import { StaffEntity } from 'src/staffs/entities/staff.entity';

export class OrderEntity implements Order {
  @ApiProperty()
  id: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  totalNoOfBags: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  staffId: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  deliveryStatus: string;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  outStandingPayment: number;

  @ApiProperty()
  note: string;

  @ApiProperty({ required: false, type: () => CustomerEntity })
  customer?: CustomerEntity;

  @ApiProperty({ required: false, type: StaffEntity })
  staff?: StaffEntity;

  @ApiProperty({ required: false, type: () => OrderListEntity, isArray: true })
  orderLists?: OrderListEntity[];

  constructor({ customer, staff, orderLists, ...data }: Partial<OrderEntity>) {
    Object.assign(this, data);

    if (customer) {
      this.customer = new CustomerEntity(customer);
    }

    if (staff) {
      this.staff = new StaffEntity(staff);
    }

    if (orderLists) {
      this.orderLists = orderLists.map(
        (orderList) => new OrderListEntity(orderList),
      );
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
