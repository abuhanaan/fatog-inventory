import { ApiProperty } from '@nestjs/swagger';
import { StockList } from '@prisma/client';
import { ProductEntity } from 'src/products/entities/product.entity';
import { StockEntity } from 'src/stocks/entities/stock.entity';

export class NewStockListEntity implements StockList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  refId: string;

  @ApiProperty()
  stockRefId: string;

  @ApiProperty()
  productRefId: string;

  @ApiProperty()
  noOfBags: number;

  @ApiProperty()
  pricePerBag: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty({ required: false, type: ProductEntity })
  product?: ProductEntity;

  @ApiProperty({ required: false, type: () => StockEntity })
  stock?: StockEntity;

  constructor({ product, stock, ...data }: Partial<NewStockListEntity>) {
    Object.assign(this, data);

    if (product) {
      this.product = new ProductEntity(product);
    }

    if (stock instanceof StockEntity) {
      this.stock = stock;
    }
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date;
}
