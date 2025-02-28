import { Module } from '@nestjs/common';
import { CalendlyController } from './calendly.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity'; 
import { CalendlyApiService } from './clanedly.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users])], 
  providers: [CalendlyApiService],
  controllers: [CalendlyController],
  exports: [CalendlyApiService],
})
export class CalendlyModule {}