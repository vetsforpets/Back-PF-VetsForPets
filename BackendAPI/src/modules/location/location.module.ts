import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entity/location.entity';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Users])],
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService, LocationRepository]
})
export class LocationModule {}
