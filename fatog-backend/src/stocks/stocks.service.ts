import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stock } from '@prisma/client';

@Injectable()
export class StocksService {
  constructor(private prisma: PrismaService) {}

  private checkIfStockExists(stock: Stock, id: number) {
    if (!stock) {
      throw new NotFoundException({
        message: `Stock with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }
  async create(createStockDto: CreateStockDto, user: UserEntity) {
    const staff = await this.prisma.staff.findFirst({
      where: { staffId: user.id },
    });

    if (!staff) {
      throw new UnauthorizedException({
        message: 'You are not authorised to perform this operation',
        error: 'Unauthorised Request',
      });
    }
    createStockDto.staffId = staff.staffId;
    const stock = await this.prisma.stock.create({ data: createStockDto });
    return stock;
  }

  findAll() {
    return this.prisma.stock.findMany({
      include: { stockLists: true, staff: true },
    });
  }

  async findOne(id: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: {
        staff: true,
        stockLists: {
          include: {
            product: true,
          },
        },
      },
    });
    await this.checkIfStockExists(stock, id);
    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
    });
    await this.checkIfStockExists(stock, id);
    return this.prisma.stock.update({
      where: { id },
      data: updateStockDto,
      include: {
        staff: true,
        stockLists: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    try {
      // Find the stock record
      const stock = await this.prisma.stock.findUnique({
        where: { id },
        include: { stockLists: true }, // Include related stock items
      });
      await this.checkIfStockExists(stock, id);

      // Initialize transaction operations array
      const transactionOperations = [];

      // Update inventory and inventory history for each stock item to undo effects
      for (const stockItem of stock.stockLists) {
        const inventory = await this.updateInventory(
          stockItem.productRefId,
          stockItem.noOfBags,
        );
        transactionOperations.push(inventory);
      }

      // Delete all related stock items
      transactionOperations.push(
        this.prisma.stockList.deleteMany({ where: { id } }),
      );

      // Delete the stock record
      transactionOperations.push(this.prisma.stock.delete({ where: { id } }));

      // Start the transaction with the array of promises
      await this.prisma.$transaction(transactionOperations);

      // return `Stock with ID ${id} and its related items have been deleted, and inventory has been updated.`;
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: `Failed to delete stock with ID ${id}`,
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
          note: 'Rollback operation from a deleted stock entry',
        },
      }),
    ]);
  }
}
