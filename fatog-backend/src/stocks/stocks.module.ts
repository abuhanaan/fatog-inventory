import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StocksController],
  providers: [StocksService],
  imports: [PrismaModule],
  exports: [StocksService],
})
export class StocksModule {}
