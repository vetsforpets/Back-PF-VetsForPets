import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { Location } from './entity/location.entity';
import { CurrentLocationDto } from './dto/currentLocation.dto';

export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  findAllLocations() {
    try {
      const locations = this.locationRepository.find();
      return locations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al obtener las ubicaciones de la base de datos',
      );
    }
  }

  findOneLocation(id: string) {
    try {
      const locationFiltered = this.locationRepository.findBy(id);
      return locationFiltered;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        `Ha ocurrido un error al recuperar la orden por ID ${id} desde la base de datos`,
      );
    }
  }

  getCurrentLocation(
    latitude: GeolibLatitudeInputValue,
    longitude: GeolibLongitudeInputValue,
    radius: number,
  ) {
    try {
      const currentLoc = this.locationRepository.getCurrentLocation(
        latitude,
        longitude,
        radius,
      );
      return currentLoc;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al recuperar la ubicacion actual del usuario',
      );
    }
  }

  saveLocation(location: Location | Location[]) {
    try {
      const locationToSave = this.locationRepository.save(location);
      return locationToSave;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al recuperar la ubicacion actual del usuario',
      );
    }
  }

  findPetShopsByDistance(center: CurrentLocationDto) {
    try {
      const shopsFilteredByDistance =
        this.locationRepository.findByDistance(center);
      return shopsFilteredByDistance;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al organizar las tiendas en orden, el error viene desde la base de datos',
      );
    }
  }
}
