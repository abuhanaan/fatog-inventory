import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManufacturerEntity } from './entities/manufacturer.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('manufacturers')
@ApiTags('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ManufacturerEntity })
  async create(@Body() createManufacturerDto: CreateManufacturerDto) {
    const newManufacturer = await this.manufacturersService.create(
      createManufacturerDto,
    );
    // return new ManufacturerEntity(newManufacturer);
    return newManufacturer;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ManufacturerEntity, isArray: true })
  async findAll() {
    const manufacturers = await this.manufacturersService.findAll();
    // return manufacturers.map(
    //   (manufacturer) => new ManufacturerEntity(manufacturer),
    // );
    return manufacturers;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ManufacturerEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const manufacturer = await this.manufacturersService.findOne(id);
    // return new ManufacturerEntity(manufacturer);
    return new ManufacturerEntity(manufacturer);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ManufacturerEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    const manufacturer = await this.manufacturersService.update(
      id,
      updateManufacturerDto,
    );
    // return new ManufacturerEntity(manufacturer);
    return manufacturer;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ManufacturerEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const manufacturer = await this.manufacturersService.remove(id);
    // return new ManufacturerEntity(manufacturer);
    manufacturer;
  }
}
