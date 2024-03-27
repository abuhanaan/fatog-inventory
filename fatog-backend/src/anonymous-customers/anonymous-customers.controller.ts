import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnonymousCustomersService } from './anonymous-customers.service';
import { CreateAnonymousCustomerDto } from './dto/create-anonymous-customer.dto';
import { UpdateAnonymousCustomerDto } from './dto/update-anonymous-customer.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AnonymousCustomerEntity } from './entities/anonymous-customer.entity';

@Controller('anonymous-customers')
export class AnonymousCustomersController {
  constructor(
    private readonly anonymousCustomersService: AnonymousCustomersService,
  ) {}

  // @Post()
  // create(@Body() createAnonymousCustomerDto: CreateAnonymousCustomerDto) {
  //   return this.anonymousCustomersService.create(createAnonymousCustomerDto);
  // }

  @Get()
  @ApiOkResponse({ type: AnonymousCustomerEntity, isArray: true })
  async findAll() {
    const anonymousCustomers = await this.anonymousCustomersService.findAll();
    return anonymousCustomers.map(
      (anonymousCustomer) => new AnonymousCustomerEntity(anonymousCustomer),
    );
  }

  @Get(':phoneNumber')
  @ApiOkResponse({ type: AnonymousCustomerEntity })
  async findOne(@Param('phoneNumber') phoneNumber: string) {
    const anonymousCustomer =
      await this.anonymousCustomersService.findOne(phoneNumber);
    return new AnonymousCustomerEntity(anonymousCustomer);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAnonymousCustomerDto: UpdateAnonymousCustomerDto) {
  //   return this.anonymousCustomersService.update(+id, updateAnonymousCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.anonymousCustomersService.remove(+id);
  // }
}
