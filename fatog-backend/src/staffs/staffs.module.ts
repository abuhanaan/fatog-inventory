import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StaffsController],
  providers: [StaffsService],
  imports: [PrismaModule],
  exports: [StaffsService],
})
export class StaffsModule {}
