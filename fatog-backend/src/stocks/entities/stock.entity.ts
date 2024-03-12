import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '@prisma/client';
import { StaffEntity } from 'src/staffs/entities/staff.entity';
import { StockListEntity } from 'src/stock-lists/entities/stock-list.entity';

export class StockEntity implements Stock {
  @ApiProperty()
  id: number;

  @ApiProperty()
  refId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  totalNoOfBags: number;

  @ApiProperty()
  staffId: number;

  @ApiProperty()
  invoice: string;

  @ApiProperty({ required: false, type: () => StaffEntity })
  staff?: StaffEntity;

  @ApiProperty({ required: false, type: () => StockListEntity, isArray: true })
  stockLists?: StockListEntity[];

  constructor({ stockLists, staff, ...data }: Partial<StockEntity>) {
    Object.assign(this, data);

    if (stockLists) {
      this.stockLists = stockLists.map(
        (stockList) => new StockListEntity(stockList),
      );
    }

    if (staff) {
      this.staff = new StaffEntity(staff);
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
