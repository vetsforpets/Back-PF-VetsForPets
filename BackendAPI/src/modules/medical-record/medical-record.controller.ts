import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MedicalRecordDto } from './dto/medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Medical Record")
@Controller('medical_record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) { }

  @Post('addRecord')
  addRecord(@Body() medicalRecord: MedicalRecordDto) {
    return this.medicalRecordService.addRecord(medicalRecord);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.medicalRecordService.findById(id);
  }

  @Put('update/:id')
  updateRecord(@Param('id') id: string, @Body() data: UpdateMedicalRecordDto) {
    return this.medicalRecordService.updateRecord(id, data);
  }


}
