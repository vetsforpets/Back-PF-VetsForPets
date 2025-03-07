import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { MedicalRecordDto } from './dto/medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Medical Records')
@UseGuards(RolesGuard)
@Admin()
@Roles(Role.PETSHOP)
@ApiBearerAuth()
@Controller('medicalRecord')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post('addRecord')
  @ApiOperation({ summary: 'Agregar historial médico' })
  @ApiCreatedResponse({ description: 'Historial médico agregado con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiQuery({ name: 'petId', description: 'ID de la mascota', required: true })
  @ApiQuery({ name: 'petshopId', description: 'ID de la tienda de mascotas', required: true })
  addRecord(
    @Body() medicalRecord: MedicalRecordDto,
    @Query('petId') petId: string,
    @Query('petshopId') petshopId: string,
  ) {
    return this.medicalRecordService.addRecord(medicalRecord, petId, petshopId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener historial médico por ID' })
  @ApiOkResponse({ description: 'Historial médico encontrado con éxito' })
  @ApiNotFoundResponse({ description: 'Historial médico no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findById(@Param('id') id: string) {
    return this.medicalRecordService.findById(id);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Actualizar historial médico por ID' })
  @ApiOkResponse({ description: 'Historial médico actualizado con éxito' })
  @ApiNotFoundResponse({ description: 'Historial médico no encontrado' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  updateRecord(@Param('id') id: string, @Body() data: UpdateMedicalRecordDto) {
    return this.medicalRecordService.updateRecord(id, data);
  }
}