import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { UsersRepository } from '../users/users.repository';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';
import { PetShopModule } from '../pet-shop/pet-shop.module';
import { PetShopRepository } from '../pet-shop/pet-shop.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users, PetShop]), UsersModule, PetShopModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, PetShopRepository],
  exports: [AuthService],
})
export class AuthModule {}
