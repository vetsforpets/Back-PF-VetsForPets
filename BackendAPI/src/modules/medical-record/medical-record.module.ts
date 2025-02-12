import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRepository } from './medical-record.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, MedicalRecordRepository],
})
export class MedicalRecordModule { }
