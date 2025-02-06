import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),UsersModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
  exports: [AuthService]
})
export class AuthModule {}
