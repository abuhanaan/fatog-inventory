import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousCustomersService } from './anonymous-customers.service';

describe('AnonymousCustomersService', () => {
  let service: AnonymousCustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonymousCustomersService],
    }).compile();

    service = module.get<AnonymousCustomersService>(AnonymousCustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
