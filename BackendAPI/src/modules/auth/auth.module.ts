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
import { EmailModule } from '../common/email/email.module';
import { EmailService } from '../common/email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuardStrategy } from '../common/strategies/jwt.auth.strategy';
import { JwtGuard } from '../common/guards/jwt.auth.guard';
import { GoogleStrategy } from '../common/strategies/google.oauth.strategy';
import { Location } from '../location/entity/location.entity';
import { LocationModule } from '../location/location.module';


@Module({
  imports: [TypeOrmModule.forFeature([Users, PetShop, Location]), UsersModule, PetShopModule, EmailModule, LocationModule,
  JwtModule.registerAsync({
    useFactory: () => ({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h'
      },
      global: true
    })
  })
  
  ],   
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, PetShopRepository, EmailService, JwtGuardStrategy, JwtGuard, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule { }
