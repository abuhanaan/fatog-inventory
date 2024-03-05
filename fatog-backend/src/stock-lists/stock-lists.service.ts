import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStockListDto } from './dto/create-stock-list.dto';
import { UpdateStockListDto } from './dto/update-stock-list.dto';
import { CreateStockListArrayDto } from './dto/create-stock-list-array.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateStockDto } from 'src/stocks/dto/create-stock.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';
import { StockList } from '@prisma/client';
import { StockListEntity } from './entities/stock-list.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

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
  ): Promise<StockListEntity[]> {
    try {
      const staff = await this.prisma.staff.findFirst({
        where: { staffId: user.id },
      });

      if (!staff) {
        throw new UnauthorizedException({
          message: 'You are not authorized to perform this operation',
          error: 'Unauthorized Operation',
        });
      }
      const { data: stockListData } = createStockListArrayDto;

      // Calculate total amount, weight, and number of bags
      let totalAmount = 0;
      let totalWeight = 0;
      let totalNoOfBags = 0;
      for (const memberStock of stockListData) {
        totalAmount += memberStock.totalAmount;
        totalWeight += memberStock.totalWeight;
        totalNoOfBags += memberStock.noOfBags;
      }

      // Create the stock record
      const stockDTO: CreateStockDto = {
        totalAmount,
        totalWeight,
        totalNoOfBags,
        staffId: user.id,
      };

      // Initialize an array to store promises for transaction operations
      const transactionOperations = [];

      const stock = await this.stockService.create(stockDTO, user);

      // Push stock creation into transactionOperations array
      transactionOperations.push(stock);

      // Update inventory and inventory history for each stock item
      for (const memberStock of stockListData) {
        const inventory = await this.updateInventory(
          memberStock.productRefId,
          memberStock.noOfBags,
        );
        transactionOperations.push(inventory);
      }

      // Create stock lists
      const createdStockItems = await this.prisma.stockList.createMany({
        data: stockListData.map((stockItem) => ({
          ...stockItem,
          stockId: stock.id,
        })),
      });
      transactionOperations.push(createdStockItems);

      // Start the transaction with the array of promises
      await this.prisma.$transaction(transactionOperations);

      // Return formatted stock items
      const formattedStockItems = await this.getFormattedStockItems(stock.id);
      return formattedStockItems;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Failed to create stock and update inventory',
        error: 'Internal Server Error',
      });
    }
  }

  private async updateInventory(productRefId: string, quantity: number) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { productRefId },
    });
    if (!inventory) {
      throw new NotFoundException({
        message: `Inventory not found for product ID ${productRefId}`,
        error: 'Not Found',
      });
    }

    return this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { id: inventory.id },
        data: { remainingQty: { increment: quantity } },
      }),
      this.prisma.inventoryHistory.create({
        data: {
          inventoryId: inventory.id,
          remainderBefore: inventory.remainingQty,
          remainderAfter: inventory.remainingQty + quantity,
          effectQuantity: quantity,
          increment: true,
          decrement: false,
        },
      }),
    ]);
  }

  private async getFormattedStockItems(
    stockId: number,
  ): Promise<StockListEntity[]> {
    const stockItems = await this.prisma.stockList.findMany({
      where: { stockId },
      include: { stock: true, product: true },
    });
    return Promise.all(
      stockItems.map(async (stockItem) => {
        return {
          ...stockItem,
          stock: await new StockEntity(stockItem.stock),
          // product: await new ProductEntity(stockItem.product),
        };
      }),
    );
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
    try {
      // Fetch the StockItem to be deleted along with its related Stock and Product
      const stockItem = await this.prisma.stockList.findUnique({
        where: { id },
        include: { product: true, stock: true },
      });

      // Check if the StockItem exists
      this.checkIfStockListExist(stockItem, id);

      // Update inventory by decrementing remainingQty for the corresponding product
      const inventory = await this.updateInventoryByStockRemoval(
        stockItem.productRefId,
        -stockItem.noOfBags,
      );

      // Delete the StockItem
      await this.prisma.stockList.delete({ where: { id } });

      return `StockItem with id ${id} has been deleted, and inventory has been updated.`;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: `Failed to delete StockItem with ID ${id}`,
        error: 'Internal Server Error',
      });
    }
  }

  private async updateInventoryByStockRemoval(
    productRefId: string,
    quantity: number,
  ) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { productRefId },
    });
    if (!inventory) {
      throw new NotFoundException({
        message: `Inventory not found for product ID ${productRefId}`,
        error: 'Not Found',
      });
    }

    // Decrement remainingQty for the corresponding product
    return this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { id: inventory.id },
        data: { remainingQty: { decrement: quantity } },
      }),
      this.prisma.inventoryHistory.create({
        data: {
          stockItemId: null,
          inventoryId: inventory.id,
          remainderBefore: inventory.remainingQty,
          remainderAfter: inventory.remainingQty - quantity,
          effectQuantity: quantity,
          increment: false,
          decrement: true,
          note: `Rollback operation from deleted StockItem with ID`,
        },
      }),
    ]);
  }
}
