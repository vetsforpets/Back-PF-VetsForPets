import { Test, TestingModule } from '@nestjs/testing';
import { PetShopController } from './pet-shop.controller';

describe('PetShopController', () => {
  let controller: PetShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetShopController],
    }).compile();

    controller = module.get<PetShopController>(PetShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
