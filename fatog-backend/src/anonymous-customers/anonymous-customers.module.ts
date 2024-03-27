import { Module } from '@nestjs/common';
import { AnonymousCustomersService } from './anonymous-customers.service';
import { AnonymousCustomersController } from './anonymous-customers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AnonymousCustomersController],
  providers: [AnonymousCustomersService],
  exports: [AnonymousCustomersService],
  imports: [PrismaModule],
})
export class AnonymousCustomersModule {}
