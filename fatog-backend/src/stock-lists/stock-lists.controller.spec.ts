import { Test, TestingModule } from '@nestjs/testing';
import { StockListsController } from './stock-lists.controller';
import { StockListsService } from './stock-lists.service';

describe('StockListsController', () => {
  let controller: StockListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockListsController],
      providers: [StockListsService],
    }).compile();

    controller = module.get<StockListsController>(StockListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
