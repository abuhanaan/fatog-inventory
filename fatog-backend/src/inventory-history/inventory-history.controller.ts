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
import { InventoryHistoryService } from './inventory-history.service';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InventoryHistoryEntity } from './entities/inventory-history.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('inventory-history')
@ApiTags('inventory-history')
export class InventoryHistoryController {
  constructor(
    private readonly inventoryHistoryService: InventoryHistoryService,
  ) {}

  // @Post()
  // create(@Body() createInventoryHistoryDto: CreateInventoryHistoryDto) {
  //   return this.inventoryHistoryService.create(createInventoryHistoryDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: InventoryHistoryEntity, isArray: true })
  async findAll() {
    const histories = await this.inventoryHistoryService.findAll();
    return histories.map((history) => new InventoryHistoryEntity(history));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const history = await this.inventoryHistoryService.findOne(id);
    return new InventoryHistoryEntity(history);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateInventoryHistoryDto: UpdateInventoryHistoryDto,
  // ) {
  //   return this.inventoryHistoryService.update(+id, updateInventoryHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.inventoryHistoryService.remove(+id);
  // }
}
