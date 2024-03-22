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
import { StockListsService } from './stock-lists.service';
import { CreateStockListDto } from './dto/create-stock-list.dto';
import { UpdateStockListDto } from './dto/update-stock-list.dto';
import { CreateStockListArrayDto } from './dto/create-stock-list-array.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StockListEntity } from './entities/stock-list.entity';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('stock-lists')
@ApiTags('stock-lists')
export class StockListsController {
  constructor(private readonly stockListsService: StockListsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: StockListEntity, isArray: true })
  async create(
    @Body() createStockListArrayDto: CreateStockListArrayDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    console.log(user);
    const stocklists = await this.stockListsService.create(
      createStockListArrayDto,
      user,
    );
    return stocklists.map((stocklist) => new StockListEntity(stocklist));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StockListEntity, isArray: true })
  async findAll() {
    const stockLists = await this.stockListsService.findAll();
    return stockLists.map((stockList) => new StockListEntity(stockList));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StockListEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const stockList = await this.stockListsService.findOne(id);
    return new StockListEntity(stockList);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StockListEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockListDto: UpdateStockListDto,
  ) {
    const stockList = await this.stockListsService.update(
      id,
      updateStockListDto,
    );
    return new StockListEntity(stockList);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: String })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const stockList = await this.stockListsService.remove(+id);
    return stockList;
  }
}
