import { Controller, Get, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { CalendlyApiService } from './clanedly.service';
import { ListEventsQueryDto } from './dto/list-events-query.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Calendly')
@Controller('calendly')
export class CalendlyController {
  constructor(private readonly calendlyApiService: CalendlyApiService) {}

  @ApiBearerAuth()
  @Get('events')
  @ApiOperation({ summary: 'Obtener eventos de Calendly' })
  @ApiOkResponse({ description: 'Lista de eventos de Calendly obtenida con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  async getCalendlyEvents(
    @Query(new ValidationPipe({ transform: true })) query: ListEventsQueryDto,
  ): Promise<any> {
    try {
      return await this.calendlyApiService.listEvents(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al obtener eventos de Calendly', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}