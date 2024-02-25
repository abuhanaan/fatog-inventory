import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private checkIfProductExists(product: Product, id: number) {
    if (!product) {
      throw new NotFoundException({
        message: `Product with id ${id} does not exist`,
        error: 'Not Found',
      });
    }
  }

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: createProductDto.name },
    });
    if (existingProduct) {
      throw new ConflictException({
        message: `Product ${createProductDto.name} already exists`,
        error: 'Conflict Operation',
      });
    }
    const newProduct = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        type: createProductDto.type,
        weight: createProductDto.weight,
        pricePerBag: createProductDto.pricePerBag,
        size: createProductDto.size,
        manufacturerId: createProductDto.manufacturerId,
      },
    });
    return newProduct;
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { manufacturer: true },
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    await this.checkIfProductExists(product, id);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    await this.checkIfProductExists(product, id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    await this.checkIfProductExists(product, id);
    return this.prisma.product.delete({ where: { id } });
  }
}
