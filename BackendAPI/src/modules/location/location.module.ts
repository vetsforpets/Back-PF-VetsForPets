import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService, LocationRepository]
})
export class LocationModule {}
