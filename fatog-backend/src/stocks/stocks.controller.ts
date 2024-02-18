import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockEntity } from './entities/stock.entity';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('stocks')
@ApiTags('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  @ApiCreatedResponse({ type: StockEntity })
  async create(
    @Body() createStockDto: CreateStockDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    const stock = await this.stocksService.create(createStockDto, user);
    return new StockEntity(stock);
  }

  @Get()
  @ApiOkResponse({ type: StockEntity, isArray: true })
  async findAll() {
    const stocks = await this.stocksService.findAll();
    return stocks.map((stock) => new StockEntity(stock));
  }

  @Get(':id')
  @ApiOkResponse({ type: StockEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const stock = await this.stocksService.findOne(id);
    return new StockEntity(stock);
  }

  @Patch(':id')
  @ApiOkResponse({ type: StockEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    const stock = await this.stocksService.update(id, updateStockDto);
    return new StockEntity(stock);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StockEntity })
  async remove(@Param('id') id: string) {
    const stock = await this.stocksService.remove(+id);
    return new StockEntity(stock);
  }
}
