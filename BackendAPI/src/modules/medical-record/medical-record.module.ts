import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordRepository } from './medical-record.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entity/medical-record.entity';
import { Pets } from '../pets/entity/pets.entity';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Pets, PetShop, Appointment]), FileUploadModule],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, MedicalRecordRepository],
})
export class MedicalRecordModule { }
