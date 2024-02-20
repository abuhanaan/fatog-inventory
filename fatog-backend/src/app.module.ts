import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { StaffsModule } from './staffs/staffs.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { ProductsModule } from './products/products.module';
import { StocksModule } from './stocks/stocks.module';
import { StockListsModule } from './stock-lists/stock-lists.module';
import { OrdersModule } from './orders/orders.module';
import { OrderListsModule } from './order-lists/order-lists.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CustomerModule, StaffsModule, ManufacturersModule, ProductsModule, StocksModule, StockListsModule, OrdersModule, OrderListsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
