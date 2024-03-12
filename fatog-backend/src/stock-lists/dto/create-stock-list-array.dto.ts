import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockListDto } from './create-stock-list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockListArrayDto {
  @IsArray()
  @ApiProperty({ type: CreateStockListDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStockListDto)
  data: CreateStockListDto[];
}
