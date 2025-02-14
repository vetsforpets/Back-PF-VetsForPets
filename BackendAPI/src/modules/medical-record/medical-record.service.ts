import { Injectable } from '@nestjs/common';
import { MedicalRecordDto } from './dto/medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordRepository } from './medical-record.repository';

@Injectable()
export class MedicalRecordService {

  constructor(private medicalRecordRepository: MedicalRecordRepository) { }


  addRecord(record: MedicalRecordDto, petId: string, petshopId: string) {
    return this.medicalRecordRepository.addRecord(record, petId, petshopId)
  }

  findById(id: string) {
    return this.medicalRecordRepository.findById(id)
  }

  updateRecord(id: string, data: UpdateMedicalRecordDto) {
    return this.medicalRecordRepository.updateRecord(id, data)
  }


}
