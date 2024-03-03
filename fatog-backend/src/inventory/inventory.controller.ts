import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InventoryEntity } from './entities/inventory.entity';

@Controller('inventory')
@ApiTags('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiCreatedResponse({ type: InventoryEntity })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoryService.create(createInventoryDto);
    return new InventoryEntity(inventory);
  }

  @Get()
  @ApiOkResponse({ type: InventoryEntity, isArray: true })
  async findAll() {
    const inventories = await this.inventoryService.findAll();
    return inventories.map((inventory) => new InventoryEntity(inventory));
  }

  @Get(':id')
  @ApiOkResponse({ type: InventoryEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const inventory = await this.inventoryService.findOne(id);
    // return new InventoryEntity(inventory);
    return inventory;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
