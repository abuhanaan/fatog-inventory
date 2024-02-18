import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockListDto } from './dto/create-stock-list.dto';
import { UpdateStockListDto } from './dto/update-stock-list.dto';
import { CreateStockListArrayDto } from './dto/create-stock-list-array.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { StockList } from '@prisma/client';

@Injectable()
export class StockListsService {
  constructor(
    private prisma: PrismaService,
    private stockService: StocksService,
  ) {}
  private checkIfStockListExist(stockList: StockList, id: number) {
    if (!stockList) {
      throw new NotFoundException({
        message: `StockList with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }
  async create(
    createStockListArrayDto: CreateStockListArrayDto,
    user: UserEntity,
  ) {
    let totalAmount = 0;
    let totalWeight = 0;
    let totalNoOfBags = 0;
    const stockListData = createStockListArrayDto.data.map((memberStock) => {
      totalAmount += memberStock.totalAmount;
      totalWeight += memberStock.totalWeight;
      totalNoOfBags += memberStock.noOfBags;
      return { ...memberStock, stockId: undefined };
    });
    const stockDTO: CreateStockDto = {
      totalAmount,
      totalWeight,
      totalNoOfBags,
      staffId: user.id,
    };
    const stock = await this.prisma.stock.create({ data: stockDTO });
    stockListData.forEach((memberStock) => {
      // TODO: work around affecting inventory with stock
      memberStock.stockId = stock.id;
    });
    const createdStockLists = await this.prisma.stockList.createMany({
      data: createStockListArrayDto.data,
    });
    // Fetch the newly created stock lists with their related entities
    const stockLists = await this.prisma.stockList.findMany({
      where: { stockId: stock.id },
      include: { stock: true, product: true },
    });
    // Convert the retrieved stock lists to the desired format
    const formattedStockLists = stockLists.map(async (stocklist) => {
      return {
        ...stocklist,
        stock: await new StockEntity(stocklist.stock),
      };
    });

    return Promise.all(formattedStockLists);
  }

  async findAll() {
    const stockLists = await this.prisma.stockList.findMany({
      include: { product: true, stock: true },
    });
    return stockLists;
  }

  async findOne(id: number) {
    const stockList = await this.prisma.stockList.findUnique({
      where: { id },
      include: { product: true, stock: true },
    });
    await this.checkIfStockListExist(stockList, id);
    return stockList;
  }

  async update(id: number, updateStockListDto: UpdateStockListDto) {
    const stockList = await this.prisma.stockList.findUnique({
      where: { id },
      include: { product: true, stock: true },
    });
    await this.checkIfStockListExist(stockList, id);
    return this.prisma.stockList.update({
      where: { id },
      data: updateStockListDto,
    });
  }

  async remove(id: number) {
    const stockList = await this.prisma.stockList.findUnique({
      where: { id },
      include: { product: true, stock: true },
    });
    await this.checkIfStockListExist(stockList, id);
    return this.prisma.stockList.delete({ where: { id } });
  }
}
