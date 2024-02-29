import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SalesEntity } from './entities/sale.entity';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiCreatedResponse({ type: SalesEntity })
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    const invoice = await this.salesService.create(createSaleDto, user);
    return new SalesEntity(invoice);
  }

  @Get()
  @ApiOkResponse({ type: SalesEntity, isArray: true })
  async findAll() {
    const invoices = await this.salesService.findAll();
    return invoices.map((invoice) => new SalesEntity(invoice));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    return this.salesService.update(+id, updateSaleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
