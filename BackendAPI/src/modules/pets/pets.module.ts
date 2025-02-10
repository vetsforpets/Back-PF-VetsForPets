import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { UsersRepository } from '../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Pets } from './entity/pets.entity';
import { PetsRepository } from './pets.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Users, Pets])],
  controllers: [PetsController],
  providers: [PetsService,PetsRepository, UsersRepository],
  exports:[PetsService, PetsRepository]
})
export class PetsModule {}
