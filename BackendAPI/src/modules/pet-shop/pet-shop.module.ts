import { Module } from '@nestjs/common';
import { PetShopController } from './pet-shop.controller';
import { PetShopService } from './pet-shop.service';
import { PetShopRepository } from './pet-shop.repository';

@Module({
  controllers: [PetShopController],
  providers: [PetShopService, PetShopRepository],
  exports: [PetShopService]
})
export class PetShopModule {}
