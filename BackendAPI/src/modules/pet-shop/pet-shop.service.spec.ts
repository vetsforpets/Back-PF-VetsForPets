import { Test, TestingModule } from '@nestjs/testing';
import { PetShopService } from './pet-shop.service';

describe('PetShopService', () => {
  let service: PetShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetShopService],
    }).compile();

    service = module.get<PetShopService>(PetShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
