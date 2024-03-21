import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { CustomerEntity } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // @ApiCreatedResponse({ type: CustomerEntity })
  // async create(@Body() createCustomerDto: CreateCustomerDto) {
  //   const newCustomer = await this.customerService.create(createCustomerDto);
  //   return new CustomerEntity(newCustomer);
  // }

  @Get('dashboard')
  dashboard() {}

  @Get('my-orders')
  orders() {}

  @Get()
  @ApiOkResponse({ type: CustomerEntity, isArray: true })
  async findAll() {
    const customers = await this.customerService.findAll();
    return customers.map((customer) => new CustomerEntity(customer));
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CustomerEntity })
  async findOne(
    // @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    const customer = await this.customerService.findOne(user.id);
    return new CustomerEntity(customer);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CustomerEntity })
  async update(
    // @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const user = request.user as UserEntity;
    const customer = await this.customerService.update(updateCustomerDto, user);
    return new CustomerEntity(customer);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CustomerEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.remove(id);
    return new CustomerEntity(customer);
  }
}
