import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockListDto } from './create-stock-list.dto';

export class CreateStockListArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockListDto)
  data: CreateStockListDto[];
}
