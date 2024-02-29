import { PartialType } from '@nestjs/swagger';
import { CreateInventoryHistoryDto } from './create-inventory-history.dto';

export class UpdateInventoryHistoryDto extends PartialType(CreateInventoryHistoryDto) {}
