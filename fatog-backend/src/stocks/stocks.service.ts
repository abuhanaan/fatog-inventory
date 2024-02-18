import { Injectable, NotFoundException } from '@nestjs/common';
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
    createStockDto.staffId = user.id;
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
      include: { staff: true, stockLists: true },
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
      include: { staff: true, stockLists: true },
    });
  }

  async remove(id: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
    });
    await this.checkIfStockExists(stock, id);
    return this.prisma.stock.delete({ where: { id } });
  }
}
