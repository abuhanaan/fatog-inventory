import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import { generateReferenceId } from 'src/utils/referenceIdGenerator';

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

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const referenceId = generateReferenceId();

    try {
      // Start a Prisma transaction
      const productAndInventory = await this.prisma.$transaction([
        // Create the product with the generated reference ID
        this.prisma.product.create({
          data: {
            refId: referenceId,
            name: createProductDto.name,
            type: createProductDto.type,
            pricePerBag: createProductDto.pricePerBag,
            weight: createProductDto.weight,
            size: createProductDto.size,
            manufacturerId: createProductDto.manufacturerId,
          },
        }),
        // Create inventory using the same reference ID
        this.prisma.inventory.create({
          data: {
            productRefId: referenceId,
            remainingQty: 0,
          },
        }),
      ]);

      // Return the newly created product
      return productAndInventory[0];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Failed to create product',
        error: 'Internal Server Error',
      });
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { manufacturer: true },
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        manufacturer: true,
        orderLists: true,
        stockLists: true,
        inventory: true,
      },
    });
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
