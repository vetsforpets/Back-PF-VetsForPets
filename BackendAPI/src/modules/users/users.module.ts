import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersRepository } from './users.repository';
import { Pets } from '../pets/entity/pets.entity';
import { Order } from '../order/entity/order.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { UserMembership } from '../membership/entity/user-membership.entity';
import { Location } from '../location/entity/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Order, Appointment, UserMembership, Pets, Location])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository]
})
export class UsersModule {}
