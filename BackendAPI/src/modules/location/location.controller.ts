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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Obtener todas las ubicaciones' })
  @ApiOkResponse({ description: 'Lista de ubicaciones obtenida con éxito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
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

  @Get('users')
  @Roles(Role.PETSHOP, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener ubicaciones de usuarios' })
  @ApiOkResponse({ description: 'Lista de ubicaciones de usuarios obtenida con éxito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
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
  @ApiOperation({ summary: 'Obtener ubicaciones de tiendas de mascotas' })
  @ApiOkResponse({ description: 'Lista de ubicaciones de tiendas de mascotas obtenida con éxito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findPetshopsArray() {
    try {
      const petshopLocations = this.locationService.findPetShopLocations();
      return petshopLocations;
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