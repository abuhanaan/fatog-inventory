import { Test, TestingModule } from '@nestjs/testing';
import { OrderListsService } from './order-lists.service';

describe('OrderListsService', () => {
  let service: OrderListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderListsService],
    }).compile();

    service = module.get<OrderListsService>(OrderListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
