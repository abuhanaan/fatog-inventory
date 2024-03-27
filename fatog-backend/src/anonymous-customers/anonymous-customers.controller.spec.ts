import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousCustomersController } from './anonymous-customers.controller';
import { AnonymousCustomersService } from './anonymous-customers.service';

describe('AnonymousCustomersController', () => {
  let controller: AnonymousCustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymousCustomersController],
      providers: [AnonymousCustomersService],
    }).compile();

    controller = module.get<AnonymousCustomersController>(AnonymousCustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
