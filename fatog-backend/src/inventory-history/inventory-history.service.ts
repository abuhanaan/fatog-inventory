import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StocksService } from 'src/stocks/stocks.service';
import { InventoryHistory } from '@prisma/client';

@Injectable()
export class InventoryHistoryService {
  constructor(
    private prisma: PrismaService,
    private stockService: StocksService,
  ) {}

  private checkIfHistoryExists(history: InventoryHistory, id: number) {
    if (!history) {
      throw new NotFoundException({
        message: `Inventory History with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }

  // create(createInventoryHistoryDto: CreateInventoryHistoryDto) {
  //   return 'This action adds a new inventoryHistory';
  // }

  findAll() {
    return this.prisma.inventoryHistory.findMany();
  }

  async findOne(id: number) {
    const history = await this.prisma.inventoryHistory.findUnique({
      where: { id },
      include: { inventory: true, orderItem: true, stockItem: true },
    });
    await this.checkIfHistoryExists(history, id);
    return history;
  }

  // update(id: number, updateInventoryHistoryDto: UpdateInventoryHistoryDto) {
  //   return `This action updates a #${id} inventoryHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} inventoryHistory`;
  // }
}
