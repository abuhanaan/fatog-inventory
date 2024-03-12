import {
  ConflictException,
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
import { generateReferenceId } from 'src/utils/referenceIdGenerator';

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
      const referenceId = generateReferenceId();

      const existingStock = await this.prisma.stock.findUnique({
        where: { refId: referenceId },
      });

      if (existingStock) {
        throw new ConflictException({
          message: `Stock with reference id ${referenceId} already exist`,
        });
      }
      const { data: stockListData } = createStockListArrayDto;

      // Calculate total amount, weight, and number of bags
      let overallStockTotalAmount = 0;
      let overallStockTotalWeight = 0;
      let overallStockTotalNoOfBags = 0;

      // Prepare arrays for batch operations
      const inventoryUpdateData = [];
      const stockListCreationData = [];
      const inventoryHistoryCreationData = [];

      for (const memberStock of stockListData) {
        const product = await this.prisma.product.findUnique({
          where: { refId: memberStock.productRefId },
        });
        if (!product) {
          throw new NotFoundException({
            message: `Product with id ${memberStock.productRefId} does not exist`,
            error: 'Not Found',
          });
        }
        const inventory = await this.prisma.inventory.findFirst({
          where: { productRefId: memberStock.productRefId },
        });
        if (!inventory) {
          throw new NotFoundException({
            message: `Inventory not found for product ID ${memberStock.productRefId}`,
            error: 'Not Found',
          });
        }
        memberStock.totalAmount =
          memberStock.pricePerBag * memberStock.noOfBags;
        overallStockTotalAmount += memberStock.totalAmount;
        memberStock.totalWeight = product.weight * memberStock.noOfBags;
        overallStockTotalWeight += memberStock.totalWeight;
        overallStockTotalNoOfBags += memberStock.noOfBags;

        // Prepare data for inventory update
        inventoryUpdateData.push({
          where: { id: inventory.id },
          data: { remainingQty: { increment: memberStock.noOfBags } },
        });

        const stockItemandHistoryItemRelation = generateReferenceId();

        // Prepare data for stock items creation
        stockListCreationData.push({
          refId: stockItemandHistoryItemRelation,
          stockRefId: referenceId,
          productRefId: memberStock.productRefId,
          noOfBags: memberStock.noOfBags,
          pricePerBag: memberStock.pricePerBag,
          totalWeight: memberStock.totalWeight,
          totalAmount: memberStock.totalAmount,
        });

        // Prepare data for inventory history creation
        inventoryHistoryCreationData.push({
          inventoryId: inventory.id,
          orderItemId: null,
          stockItemRefId: stockItemandHistoryItemRelation,
          remainderBefore: inventory.remainingQty,
          remainderAfter: inventory.remainingQty + memberStock.noOfBags,
          effectQuantity: memberStock.noOfBags,
          increment: true,
          decrement: false,
        });
      }

      // Create the stock record
      const stockDTO: CreateStockDto = {
        refId: referenceId,
        totalAmount: overallStockTotalAmount,
        totalWeight: overallStockTotalWeight,
        totalNoOfBags: overallStockTotalNoOfBags,
        staffId: user.id,
        invoice: '',
      };
      console.log({
        stockDTO,
        inventoryUpdateData,
        stockListCreationData,
        inventoryHistoryCreationData,
      });
      // const transaction = await this.prisma.$transaction([
      //   this.prisma.stock.create({ data: stockDTO }),
      //   this.prisma.inventory.updateMany({ data: inventoryUpdateData }),
      //   this.prisma.stockList.createMany({ data: stockListCreationData }),
      // ]);

      // const stock = transaction[0];
      // const stock = await this.prisma.stock.create({ data: stockDTO });
      // const inventoryUpdates = await this.prisma.inventory.updateMany({
      //   data: inventoryUpdateData,
      // });
      // const newStockLists = await this.prisma.stockList.createMany({
      //   data: stockListCreationData,
      // });

      const transaction = await this.prisma.$transaction(async (prisma) => {
        const stock = await prisma.stock.create({ data: stockDTO });
        // const inventoryUpdates = await prisma.inventory.updateMany({
        //   data: inventoryUpdateData,
        // });
        const inventoryUpdates = await Promise.all(
          inventoryUpdateData.map(async (updateData) => {
            const { where, data } = updateData;
            return prisma.inventory.update({
              where: { id: where.id },
              data: data,
            });
          }),
        );
        const newStockLists = await prisma.stockList.createMany({
          data: stockListCreationData,
        });
        const inventoryHistories = await prisma.inventoryHistory.createMany({
          data: inventoryHistoryCreationData,
        });

        return [stock, inventoryUpdates, newStockLists, inventoryHistories];
      });

      // const stock = transaction[0];
      // Return formatted stock items
      const formattedStockItems =
        await this.getFormattedStockItems(referenceId);
      return formattedStockItems;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Failed to create stock and update inventory',
        error: 'Internal Server Error',
      });
    }
  }

  // private async updateInventory(productRefId: string, quantity: number) {
  //   const inventory = await this.prisma.inventory.findFirst({
  //     where: { productRefId },
  //   });
  //   if (!inventory) {
  //     throw new NotFoundException({
  //       message: `Inventory not found for product ID ${productRefId}`,
  //       error: 'Not Found',
  //     });
  //   }

  //   return this.prisma.$transaction([
  //     this.prisma.inventory.update({
  //       where: { id: inventory.id },
  //       data: { remainingQty: { increment: quantity } },
  //     }),
  //     this.prisma.inventoryHistory.create({
  //       data: {
  //         inventoryId: inventory.id,
  //         remainderBefore: inventory.remainingQty,
  //         remainderAfter: inventory.remainingQty + quantity,
  //         effectQuantity: quantity,
  //         increment: true,
  //         decrement: false,
  //       },
  //     }),
  //   ]);
  // }

  private async getFormattedStockItems(
    stockRefId: string,
  ): Promise<StockListEntity[]> {
    const stockItems = await this.prisma.stockList.findMany({
      where: { stockRefId },
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
          stockItemRefId: null,
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
