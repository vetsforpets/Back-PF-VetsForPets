import { Module } from '@nestjs/common';
import { PetShopController } from './pet-shop.controller';
import { PetShopService } from './pet-shop.service';

@Module({
  controllers: [PetShopController],
  providers: [PetShopService],
  exports: [PetShopService]
})
export class PetShopModule {}
