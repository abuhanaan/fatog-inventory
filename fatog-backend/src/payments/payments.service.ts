import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { SalesEntity } from 'src/sales/entities/sale.entity';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private checkIfOrderExists(order: OrderEntity, orderId: number) {
    if (!order) {
      throw new NotFoundException({
        message: `Order with id ${orderId} does not exist`,
        error: 'Not Found',
      });
    }
  }

  private checkIfSalesExist(sales: SalesEntity, salesId: number) {
    if (!sales) {
      throw new NotFoundException({
        message: `Sales record with id ${salesId} does not exist`,
        error: 'Not Found',
      });
    }
  }

  private checkIfPaymentExist(payment: PaymentEntity, paymentId: number) {
    if (!payment) {
      throw new NotFoundException({
        message: `Payment record with id ${paymentId} does not exist`,
        error: 'Not Found',
      });
    }
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: createPaymentDto.orderId },
    });
    await this.checkIfOrderExists(order, createPaymentDto.orderId);
    const sales = await this.prisma.sales.findUnique({
      where: { id: createPaymentDto.salesId },
    });
    await this.checkIfSalesExist(sales, createPaymentDto.salesId);
    const amountPayable = sales.amountPayable;
    const pastPaymentsSummation = await this.prisma.paymentHistory.aggregate({
      where: { orderId: order.id, salesId: sales.id },
      _sum: { amountPaid: true },
    });
    const previousPayments = pastPaymentsSummation._sum.amountPaid;
    console.log({ previousPayments });
    if (previousPayments + createPaymentDto.amountPaid > amountPayable) {
      throw new ConflictException({
        message: `Summation of previous payments and the intended amount to be paid does not correlate with amount payable`,
        error: 'conflict Operation',
      });
    }
    createPaymentDto.outstandingBefore = amountPayable - previousPayments;
    createPaymentDto.prevPaymentSum = previousPayments;
    createPaymentDto.outstandingAfter =
      createPaymentDto.outstandingBefore - createPaymentDto.amountPaid;

    if (createPaymentDto.outstandingAfter < 0) {
      throw new ConflictException({
        message:
          'Overall payment is now greater than amount payable, please check payment history to confirm',
        error: 'Conflict Operation',
      });
    }

    if (createPaymentDto.outstandingAfter == 0) {
      const transaction = await this.prisma.$transaction(async (prisma) => {
        const payment = await prisma.paymentHistory.create({
          data: createPaymentDto,
        });
        const salesUpdate = await prisma.sales.update({
          where: { id: sales.id },
          data: {
            paymentStatus: 'FULLY_PAID',
            amountPaid: payment.prevPaymentSum + payment.amountPaid,
            outStandingPayment: payment.outstandingAfter,
          },
        });
        return { payment, salesUpdate };
      });
      return transaction.payment;
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const payment = await prisma.paymentHistory.create({
        data: createPaymentDto,
      });
      const salesUpdate = await prisma.sales.update({
        where: { id: sales.id },
        data: {
          amountPaid: payment.prevPaymentSum + payment.amountPaid,
          outStandingPayment: payment.outstandingAfter,
        },
      });
      return { payment, salesUpdate };
    });

    return transaction.payment;
  }

  findAll() {
    return this.prisma.paymentHistory.findMany();
  }

  async findOne(id: number) {
    const payment = await this.prisma.paymentHistory.findUnique({
      where: { id },
    });
    await this.checkIfPaymentExist(payment, id);
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.prisma.paymentHistory.findUnique({
      where: { id },
    });
    await this.checkIfPaymentExist(payment, id);
    return this.prisma.paymentHistory.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async remove(id: number) {
    const payment = await this.prisma.paymentHistory.findUnique({
      where: { id },
    });
    await this.checkIfPaymentExist(payment, id);
    return this.prisma.paymentHistory.delete({ where: { id } });
  }
}
