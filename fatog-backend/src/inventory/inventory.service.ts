import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFound } from '@aws-sdk/client-s3';
import { InventoryEntity } from './entities/inventory.entity';
import { Inventory } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private async checkIfInventoryExists(inventory: Inventory, id: number) {
    if (!inventory) {
      throw new NotFoundException({
        message: `Inventory with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const existingInventory = await this.prisma.inventory.findFirst({
      where: { productRefId: createInventoryDto.productRefId },
    });
    if (existingInventory) {
      throw new ConflictException({
        message: `Inventory already exist for product with id: ${createInventoryDto.productRefId}`,
        error: 'Conflict Operation',
      });
    }
    createInventoryDto.remainingQty = 0;
    return this.prisma.inventory.create({ data: createInventoryDto });
  }

  async findAll() {
    const inventories = await this.prisma.inventory.findMany({
      include: { product: true },
    });

    return inventories;
  }

  async findOne(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: { product: true, history: true },
    });
    console.log({ id, inventory });
    await this.checkIfInventoryExists(inventory, id);
    return inventory;
  }

  async history(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: { product: true, history: true },
    });
    await this.checkIfInventoryExists(inventory, id);
    const histories = await this.prisma.inventoryHistory.findMany({
      where: { inventoryId: inventory.id },
    });
    return histories;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: { product: true },
    });
    await this.checkIfInventoryExists(inventory, id);
    return this.prisma.inventory.update({
      where: { id },
      data: updateInventoryDto,
    });
  }

  async remove(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: { product: true },
    });
    await this.checkIfInventoryExists(inventory, id);
    return this.prisma.inventory.delete({ where: { id } });
  }
}
