import { Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity'; 
import { CalendlyApiService } from './clanedly.service';
import { JwtGuard } from '../common/guards/jwt.auth.guard';
import { JwtGuardStrategy } from '../common/strategies/jwt.auth.strategy';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users])], 
  providers: [CalendlyApiService, JwtGuard, JwtGuardStrategy],
  controllers: [CalendlyController],
  exports: [CalendlyApiService],
})
export class CalendlyModule {}