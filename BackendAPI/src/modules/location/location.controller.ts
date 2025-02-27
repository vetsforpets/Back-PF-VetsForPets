import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;

@ApiTags('Location')
@UseGuards(RolesGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
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

  @Get('petshops')
  @Roles(Role.PETSHOP, Role.USER)
  @ApiBearerAuth()
  findPetshopsArray(){
    try {
      const petshopLocations = this.locationService.findPetShopLocations()
      return petshopLocations
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
