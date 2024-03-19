import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaymentEntity } from './entities/payment.entity';

@Controller('payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiCreatedResponse({ type: PaymentEntity })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return new PaymentEntity(payment);
  }

  @Get()
  @ApiOkResponse({ type: PaymentEntity, isArray: true })
  async findAll() {
    const payments = await this.paymentsService.findAll();
    return payments.map((payment) => new PaymentEntity(payment));
  }

  @Get(':id')
  @ApiOkResponse({ type: PaymentEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const payment = await this.paymentsService.findOne(id);
    return new PaymentEntity(payment);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PaymentEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment = await this.paymentsService.update(id, updatePaymentDto);
    return new PaymentEntity(payment);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PaymentEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const payment = await this.paymentsService.remove(id);
    return new PaymentEntity(payment);
  }
}
