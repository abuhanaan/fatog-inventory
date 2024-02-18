import { Test, TestingModule } from '@nestjs/testing';
import { StockListsService } from './stock-lists.service';

describe('StockListsService', () => {
  let service: StockListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockListsService],
    }).compile();

    service = module.get<StockListsService>(StockListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
