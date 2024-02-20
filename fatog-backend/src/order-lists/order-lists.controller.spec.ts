import { Test, TestingModule } from '@nestjs/testing';
import { OrderListsController } from './order-lists.controller';
import { OrderListsService } from './order-lists.service';

describe('OrderListsController', () => {
  let controller: OrderListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderListsController],
      providers: [OrderListsService],
    }).compile();

    controller = module.get<OrderListsController>(OrderListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
