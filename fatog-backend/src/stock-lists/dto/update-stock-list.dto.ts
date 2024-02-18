import { PartialType } from '@nestjs/swagger';
import { CreateStockListDto } from './create-stock-list.dto';

export class UpdateStockListDto extends PartialType(CreateStockListDto) {}
