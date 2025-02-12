import { PartialType } from '@nestjs/mapped-types';
import { MedicalRecordDto } from './medical-record.dto';

export class UpdateMedicalRecordDto extends PartialType(MedicalRecordDto) { }
