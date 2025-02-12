import { Module } from '@nestjs/common';
import { PetShopController } from './pet-shop.controller';
import { PetShopService } from './pet-shop.service';
import { PetShopRepository } from './pet-shop.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { Membership } from '../membership/entity/membership.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([PetShop, Appointment, Membership])],
  controllers: [PetShopController],
  providers: [PetShopService, PetShopRepository],
  exports: [PetShopService, PetShopRepository]
})
export class PetShopModule {}
