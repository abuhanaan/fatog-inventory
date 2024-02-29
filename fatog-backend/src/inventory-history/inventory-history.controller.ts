import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';

@Controller('inventory-history')
export class InventoryHistoryController {
  constructor(private readonly inventoryHistoryService: InventoryHistoryService) {}

  @Post()
  create(@Body() createInventoryHistoryDto: CreateInventoryHistoryDto) {
    return this.inventoryHistoryService.create(createInventoryHistoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryHistoryDto: UpdateInventoryHistoryDto) {
    return this.inventoryHistoryService.update(+id, updateInventoryHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryHistoryService.remove(+id);
  }
}
