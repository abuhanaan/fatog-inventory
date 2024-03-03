import { Module } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { InventoryHistoryController } from './inventory-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  controllers: [InventoryHistoryController],
  providers: [InventoryHistoryService],
  imports: [PrismaModule, StocksModule],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}
