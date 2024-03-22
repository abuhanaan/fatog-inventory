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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryHistoryEntity } from 'src/inventory-history/entities/inventory-history.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('inventory')
@ApiTags('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: InventoryEntity })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoryService.create(createInventoryDto);
    return new InventoryEntity(inventory);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: InventoryEntity, isArray: true })
  async findAll() {
    const inventories = await this.inventoryService.findAll();
    return inventories.map((inventory) => new InventoryEntity(inventory));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: InventoryEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const inventory = await this.inventoryService.findOne(id);
    // return new InventoryEntity(inventory);
    return inventory;
  }

  @Get('/history/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: InventoryHistoryEntity, isArray: true })
  async history(@Param('stockId', ParseIntPipe) id: number) {
    const histories = await this.inventoryService.history(id);
    return histories.map((history) => new InventoryHistoryEntity(history));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
