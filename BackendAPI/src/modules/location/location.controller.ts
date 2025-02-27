import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import { CurrentLocationDto } from './dto/currentLocation.dto';
export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @Public()
  @Get()
  @Roles(Role.PETSHOP, Role.USER)
  @ApiBearerAuth()
  findAllLocations() {
    try {
      const locations = this.locationService.findAllLocations();
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al recuperar las ubicaciones del servicio',
      );
    }
  }
  // @Public()
  // @Post()
  // getCurrentLocation(@Body() dto: CurrentLocationDto) {
  //   try {
  //     const currentLocation = this.locationService.getCurrentLocation(
  //       dto.latitude,
  //       dto.longitude,
  //       dto.radius,
  //     );
  //     return currentLocation;
  //   } catch (error) {
  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       'Ha ocurrido al ingresar la informacion de la ubicacion desde el servicio',
  //     );
  //   }
  // }

  @Get('users')
  @Roles(Role.PETSHOP, Role.USER)
  @ApiBearerAuth()
  findUsersArray() {
    try {
      const locations = this.locationService.findLocationsArray();
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al obtener las ubicaciones desde el servicio',
      );
    }
  }
}
