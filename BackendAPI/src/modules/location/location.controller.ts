import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @Public()
  @Get()
  //   @Roles(Role.PETSHOP, Role.USER)
  //   @ApiBearerAuth()
  findAll() {
    try {
      const locations = this.locationService.findAllLocations();
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al enviar la peticion desde el lado del cliente',
      );
    }
  }
}
