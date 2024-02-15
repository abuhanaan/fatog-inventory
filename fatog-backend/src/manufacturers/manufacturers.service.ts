import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Manufacturer } from '@prisma/client';

@Injectable()
export class ManufacturersService {
  constructor(private prismaService: PrismaService) {}

  private async checkIfManufacturerExists(brandName?: string, id?: number) {
    if (brandName) {
      const manufacturer = await this.prismaService.manufacturer.findFirst({
        where: { brandName },
      });

      if (!manufacturer) {
        throw new NotFoundException({
          message: `Manufacturer with brand ${brandName} does not exist`,
          error: 'Not Found',
        });
      }
    } else if (id) {
      const manufacturer = await this.prismaService.manufacturer.findUnique({
        where: { id },
      });

      if (!manufacturer) {
        throw new NotFoundException({
          message: `Manufacturer with ID ${id} does not exist`,
          error: 'Not Found',
        });
      }
    } else {
      throw new BadRequestException({
        message:
          'Please provide either brand name or ID to check for manufacturer existence',
        error: 'Bad Request',
      });
    }
  }

  async create(createManufacturerDto: CreateManufacturerDto) {
    await this.checkIfManufacturerExists(createManufacturerDto.brandName);
    return this.prismaService.manufacturer.create({
      data: createManufacturerDto,
    });
  }

  async findAll() {
    const manufacturers = await this.prismaService.manufacturer.findMany();
    return manufacturers;
  }

  async findManufacturerByBrandName(brand: string) {
    const manufacturer = await this.checkIfManufacturerExists(brand);
    return manufacturer;
  }

  async findOne(id: number) {
    const manufacturer = await this.checkIfManufacturerExists(
      undefined as string | undefined,
      id,
    );
    return manufacturer;
  }

  async update(id: number, updateManufacturerDto: UpdateManufacturerDto) {
    await this.checkIfManufacturerExists(undefined, id);
    return this.prismaService.manufacturer.update({
      where: { id },
      data: updateManufacturerDto,
    });
  }

  async remove(id: number) {
    await this.checkIfManufacturerExists(undefined, id);
    return this.prismaService.manufacturer.delete({ where: { id } });
  }
}
