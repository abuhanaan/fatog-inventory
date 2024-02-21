import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  private checkIfCustomerExists(customer: Customer, id: number) {
    if (!customer) {
      throw new NotFoundException({
        message: `User with id ${id} does not have a Customer Profile`,
        error: 'Not Found',
      });
    }
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { customerId: createCustomerDto.customerId },
    });
    if (existingCustomer) {
      throw new ConflictException({
        message: `Customer with Id ${createCustomerDto.customerId} already have a customer profile`,
        error: 'Conflict Operation',
      });
    }
    return this.prisma.customer.create({ data: createCustomerDto });
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany({
      include: { orders: true, user: true },
    });
    return customers;
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { user: true, orders: true },
    });
    this.checkIfCustomerExists(customer, id);
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    user: UserEntity,
  ) {
    if (id !== user.id) {
      throw new UnauthorizedException({
        message: "You are not Authorised to update someone else's profile",
        error: 'Unauthorised',
      });
    }
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    this.checkIfCustomerExists(customer, id);
    return this.prisma.customer.update({
      where: { customerId: id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { customerId: id },
    });
    this.checkIfCustomerExists(customer, id);
    return this.prisma.customer.delete({ where: { customerId: id } });
  }
}
