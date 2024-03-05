import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderListDto } from './dto/create-order-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderListArrayDto } from './dto/create-order-list-array.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrderList } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

@Injectable()
export class OrderListsService {
  constructor(
    private prisma: PrismaService,
    private orderSerive: OrdersService,
  ) {}

  private checkIfOrderListExist(orderList: OrderList, id: number) {
    if (!orderList) {
      throw new NotFoundException({
        message: `OrderList with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }
  async create(
    createOrderListArrayDto: CreateOrderListArrayDto,
    user: UserEntity,
  ) {
    let orderTotalAmount = 0;
    let orderTotalWeight = 0;
    let orderTotalNoOfBags = 0;

    const orderListData = await Promise.all(
      createOrderListArrayDto.data.map(async (orderItem) => {
        const product = await this.prisma.product.findFirst({
          where: { refId: orderItem.productRefId },
        });
        orderItem.totalPrice = product.pricePerBag * orderItem.noOfBags;
        orderItem.totalWeight = product.weight * orderItem.noOfBags;
        orderTotalAmount += orderItem.totalPrice;
        orderTotalWeight += orderItem.totalWeight;
        orderTotalNoOfBags += orderItem.noOfBags;
        return orderItem;
      }),
    );
    const orderDTO: CreateOrderDto = {
      totalAmount: orderTotalAmount,
      totalWeight: orderTotalWeight,
      totalNoOfBags: orderTotalNoOfBags,
      phoneNumber: createOrderListArrayDto.phoneNumber,
      shippingAddress: createOrderListArrayDto.shippingAddress
        ? createOrderListArrayDto.shippingAddress
        : '',
    };
    const order = await this.prisma.order.create({ data: orderDTO });
    orderListData.forEach((orderItem) => {
      // TODO: work around affecting inventory with order
      orderItem.orderId = order.id;
    });

    const createdOrderItems = await this.prisma.orderList.createMany({
      data: orderListData,
    });

    const orderItems = await this.prisma.orderList.findMany({
      where: { orderId: order.id },
      include: { order: true, product: true },
    });
    return orderItems;
  }

  findAll() {
    return this.prisma.orderList.findMany({
      include: { product: true, order: true },
    });
  }

  async findOne(id: number) {
    const orderItem = await this.prisma.orderList.findUnique({
      where: { id },
      include: { product: true, order: true },
    });
    await this.checkIfOrderListExist(orderItem, id);
    return orderItem;
  }

  async update(id: number, updateOrderListDto: UpdateOrderListDto) {
    const orderItem = await this.prisma.orderList.findUnique({
      where: { id },
      include: { product: true, order: true },
    });
    await this.checkIfOrderListExist(orderItem, id);
    return this.prisma.orderList.update({
      where: { id },
      data: updateOrderListDto,
      include: { product: true, order: true },
    });
  }

  async remove(id: number) {
    const orderItem = await this.prisma.orderList.findUnique({
      where: { id },
      include: { product: true, order: true },
    });
    await this.checkIfOrderListExist(orderItem, id);
    return this.prisma.orderList.delete({ where: { id } });
  }
}
