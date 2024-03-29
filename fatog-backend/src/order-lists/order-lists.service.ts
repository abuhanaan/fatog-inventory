import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderListDto } from './dto/create-order-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderListArrayDto } from './dto/create-order-list-array.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrderList } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { generateReferenceId } from 'src/utils/referenceIdGenerator';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { CreateAnonymousOrderListArrayDto } from './dto/create-anonymous-order-list-array.dto';

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
    console.log({ staffId: user.id, message: 'Now in the service' });
    console.log({ user });

    const referenceId = generateReferenceId();

    const existingOrder = await this.prisma.order.findUnique({
      where: { refId: referenceId },
    });

    if (existingOrder) {
      throw new ConflictException({
        message: `Order with reference id ${referenceId} already exist`,
      });
    }

    const orderListData = await Promise.all(
      createOrderListArrayDto.data.map(async (orderItem) => {
        const product = await this.prisma.product.findFirst({
          where: { refId: orderItem.productRefId },
        });
        orderItem.totalAmount = product.pricePerBag * orderItem.noOfBags;
        orderItem.totalWeight = product.weight * orderItem.noOfBags;
        orderTotalAmount += orderItem.totalAmount;
        orderTotalWeight += orderItem.totalWeight;
        orderTotalNoOfBags += orderItem.noOfBags;
        return {
          orderRefId: referenceId,
          productRefId: orderItem.productRefId,
          noOfBags: orderItem.noOfBags,
          pricePerBag: product.pricePerBag,
          totalWeight: orderItem.totalWeight,
          totalAmount: orderItem.totalAmount,
        };
      }),
    );

    const userCategory = user.category;

    const orderDTO: CreateOrderDto = {
      refId: referenceId,
      staffId: userCategory === 'staff' ? user.id : null,
      customerId: userCategory === 'customer' ? user.id : null,

      anonymousCustomerId: null,
      totalAmount: orderTotalAmount,
      totalWeight: orderTotalWeight,

      amountPaid:
        userCategory === 'staff' ? createOrderListArrayDto.amountPaid : null,
      outStandingPayment:
        userCategory === 'staff'
          ? orderTotalAmount - createOrderListArrayDto.amountPaid
          : null,

      paymentStatus:
        userCategory === 'staff'
          ? createOrderListArrayDto.paymentStatus
          : 'pending',

      deliveryStatus:
        userCategory === 'staff'
          ? createOrderListArrayDto.deliveryStatus
          : 'pending',

      totalNoOfBags: orderTotalNoOfBags,
      phoneNumber: createOrderListArrayDto.phoneNumber,
      shippingAddress: createOrderListArrayDto.shippingAddress
        ? createOrderListArrayDto.shippingAddress
        : '',
    };

    // Implementing DB transaction for order and order items creation
    const transaction = await this.prisma.$transaction([
      this.prisma.order.create({ data: orderDTO }),
      this.prisma.orderList.createMany({
        data: orderListData,
      }),
    ]);

    const orderItems = await this.prisma.orderList.findMany({
      where: { orderRefId: referenceId },
      include: { order: true, product: true },
    });

    const order: OrderEntity = transaction[0];
    // const orderItems = transaction[1];
    return orderItems;
  }

  async createAnonymousOrder(
    createAnonymousOrderListArrayDto: CreateAnonymousOrderListArrayDto,
  ) {
    let orderTotalAmount = 0;
    let orderTotalWeight = 0;
    let orderTotalNoOfBags = 0;
    const referenceId = generateReferenceId();

    const existingOrder = await this.prisma.order.findUnique({
      where: { refId: referenceId },
    });

    if (existingOrder) {
      throw new ConflictException({
        message: `Order with reference id ${referenceId} already exist`,
      });
    }

    const orderListData = await Promise.all(
      createAnonymousOrderListArrayDto.data.map(async (orderItem) => {
        const product = await this.prisma.product.findFirst({
          where: { refId: orderItem.productRefId },
        });
        orderItem.totalAmount = product.pricePerBag * orderItem.noOfBags;
        orderItem.totalWeight = product.weight * orderItem.noOfBags;
        orderTotalAmount += orderItem.totalAmount;
        orderTotalWeight += orderItem.totalWeight;
        orderTotalNoOfBags += orderItem.noOfBags;
        return {
          orderRefId: referenceId,
          productRefId: orderItem.productRefId,
          noOfBags: orderItem.noOfBags,
          pricePerBag: product.pricePerBag,
          totalWeight: orderItem.totalWeight,
          totalAmount: orderItem.totalAmount,
        };
      }),
    );

    const orderDTO: CreateOrderDto = {
      refId: referenceId,
      staffId: null,
      customerId: null,

      anonymousCustomerId: null,
      totalAmount: orderTotalAmount,
      totalWeight: orderTotalWeight,

      amountPaid: null,
      outStandingPayment: null,

      paymentStatus: 'pending',

      deliveryStatus: 'pending',

      totalNoOfBags: orderTotalNoOfBags,
      phoneNumber: createAnonymousOrderListArrayDto.phoneNumber,
      shippingAddress: createAnonymousOrderListArrayDto.shippingAddress
        ? createAnonymousOrderListArrayDto.shippingAddress
        : '',
    };

    const anonymousUser = await this.prisma.anonymousCustomer.findUnique({
      where: { phoneNumber: createAnonymousOrderListArrayDto.phoneNumber },
    });

    if (anonymousUser) {
      orderDTO.anonymousCustomerId = anonymousUser.id;
      const transaction = await this.prisma.$transaction([
        this.prisma.order.create({ data: orderDTO }),
        this.prisma.orderList.createMany({
          data: orderListData,
        }),
      ]);

      const orderItems = await this.prisma.orderList.findMany({
        where: { orderRefId: referenceId },
        include: { order: true, product: true },
      });

      const order: OrderEntity = transaction[0];
      // const orderItems = transaction[1];
      return orderItems;
    } else {
      //
      const transaction = await this.prisma.$transaction(async (prisma) => {
        const newAnonymousCustomer = await prisma.anonymousCustomer.create({
          data: {
            firstName: createAnonymousOrderListArrayDto.firstName,
            lastName: createAnonymousOrderListArrayDto.lastName,
            phoneNumber: createAnonymousOrderListArrayDto.phoneNumber,
            shippingAddress: createAnonymousOrderListArrayDto.shippingAddress,
            gender: createAnonymousOrderListArrayDto.gender,
          },
        });
        orderDTO.anonymousCustomerId = newAnonymousCustomer.id;
        const order = await prisma.order.create({ data: orderDTO });
        const orderLists = prisma.orderList.createMany({
          data: orderListData,
        });

        // create everything in the previous if block
        return { newAnonymousCustomer, order, orderLists };
      });
      const orderItems = await this.prisma.orderList.findMany({
        where: { orderRefId: transaction.order.refId },
        include: { order: true, product: true },
      });
      return orderItems;
    }
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
    // TODO: Work around updating the related order object as well
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
    // TODO: Work around updating the related order object as well

    return this.prisma.orderList.delete({ where: { id } });
  }
}
