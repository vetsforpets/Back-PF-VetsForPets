import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entity/location.entity';
import { Users } from '../users/entity/users.entity';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';
import { Appointment } from '../appointment/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Users, PetShop, Appointment])],
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService, LocationRepository]
})
export class LocationModule {}
