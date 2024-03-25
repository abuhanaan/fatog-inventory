import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private checkIfOrderExists(order: Order, id: number) {
    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }
  async create(createOrderDto: CreateOrderDto, user?: UserEntity) {
    if (user && user.category == 'customer') {
      createOrderDto.customerId = user.id;
    }
    if (user && user.category == 'staff') {
      createOrderDto.staffId = user.id;
    }
    const order = await this.prisma.order.create({ data: createOrderDto });
    return order;
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { customer: true, staff: true, orderLists: true, invoice: true },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        staff: true,
        orderLists: { include: { product: true } },
        payments: true,
        invoice: true,
      },
    });
    await this.checkIfOrderExists(order, id);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    await this.checkIfOrderExists(order, id);
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: { customer: true, staff: true, orderLists: true, invoice: true },
    });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    await this.checkIfOrderExists(order, id);
    return this.prisma.order.delete({ where: { id } });
  }
}
