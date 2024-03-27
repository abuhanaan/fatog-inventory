import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnonymousCustomerDto } from './dto/create-anonymous-customer.dto';
import { UpdateAnonymousCustomerDto } from './dto/update-anonymous-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnonymousCustomersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createAnonymousCustomerDto: CreateAnonymousCustomerDto) {
    return 'This action adds a new anonymousCustomer';
  }

  findAll() {
    return this.prisma.anonymousCustomer.findMany();
  }

  async findOne(phoneNumber: string) {
    const anonymousCustomer = await this.prisma.anonymousCustomer.findUnique({
      where: { phoneNumber },
    });
    if (!anonymousCustomer) {
      throw new NotFoundException({
        message: `Anonymous Customer with phoneNumber ${phoneNumber} does not have a record`,
        error: 'Not Found',
      });
    }
    return anonymousCustomer;
  }

  update(id: number, updateAnonymousCustomerDto: UpdateAnonymousCustomerDto) {
    return `This action updates a #${id} anonymousCustomer`;
  }

  remove(id: number) {
    return `This action removes a #${id} anonymousCustomer`;
  }
}
