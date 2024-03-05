import { Module } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { InventoryHistoryController } from './inventory-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [InventoryHistoryController],
  providers: [InventoryHistoryService],
  imports: [PrismaModule],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}
