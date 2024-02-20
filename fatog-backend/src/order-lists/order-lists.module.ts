import { Module } from '@nestjs/common';
import { OrderListsService } from './order-lists.service';
import { OrderListsController } from './order-lists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [OrderListsController],
  providers: [OrderListsService],
  imports: [PrismaModule, OrdersModule],
  exports: [OrderListsService],
})
export class OrderListsModule {}
