import { Injectable } from '@nestjs/common';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';

@Injectable()
export class InventoryHistoryService {
  create(createInventoryHistoryDto: CreateInventoryHistoryDto) {
    return 'This action adds a new inventoryHistory';
  }

  findAll() {
    return `This action returns all inventoryHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryHistory`;
  }

  update(id: number, updateInventoryHistoryDto: UpdateInventoryHistoryDto) {
    return `This action updates a #${id} inventoryHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryHistory`;
  }
}
