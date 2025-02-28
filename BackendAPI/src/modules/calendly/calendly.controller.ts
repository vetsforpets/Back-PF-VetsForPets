import { Controller, Get, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { ValidationPipe } from '@nestjs/common'; 
import { CalendlyApiService } from './clanedly.service';
import { ListEventsQueryDto } from './dto/list-events-query.dto';

@Controller('calendly')
export class CalendlyController {
  constructor(private readonly calendlyApiService: CalendlyApiService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('events')
  async getCalendlyEvents(
    @Query(new ValidationPipe({ transform: true })) query: ListEventsQueryDto, 
  ): Promise<any> {
    try {
      return await this.calendlyApiService.listEvents(query);
    } catch (error) {
      throw error;
    }
  }
}