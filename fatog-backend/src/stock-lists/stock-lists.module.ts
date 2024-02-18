import { Module } from '@nestjs/common';
import { StockListsService } from './stock-lists.service';
import { StockListsController } from './stock-lists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  controllers: [StockListsController],
  providers: [StockListsService],
  imports: [PrismaModule, StocksModule],
  exports: [StockListsService],
})
export class StockListsModule {}
