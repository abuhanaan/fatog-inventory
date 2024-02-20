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
} from '@nestjs/common';
import { OrderListsService } from './order-lists.service';
import { CreateOrderListDto } from './dto/create-order-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderListEntity } from './entities/order-list.entity';
import { CreateOrderListArrayDto } from './dto/create-order-list-array.dto';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('order-lists')
@ApiTags('order-lists')
export class OrderListsController {
  constructor(private readonly orderListsService: OrderListsService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderListEntity, isArray: true })
  async create(
    @Body() createOrderListArrayDto: CreateOrderListArrayDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    const orderLists = await this.orderListsService.create(
      createOrderListArrayDto,
      user,
    );
    return orderLists.map((orderList) => new OrderListEntity(orderList));
  }

  @Get()
  @ApiOkResponse({ type: OrderListEntity, isArray: true })
  async findAll() {
    const orderItems = await this.orderListsService.findAll();
    return orderItems.map((orderItem) => new OrderListEntity(orderItem));
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderListEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const orderItem = await this.orderListsService.findOne(id);
    return new OrderListEntity(orderItem);
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrderListEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderListDto: UpdateOrderListDto,
  ) {
    const orderItem = await this.orderListsService.update(
      id,
      updateOrderListDto,
    );
    return new OrderListEntity(orderItem);
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrderListEntity })
  async remove(@Param('id') id: string) {
    const orderItem = await this.orderListsService.remove(+id);
    return new OrderListEntity(orderItem);
  }
}
