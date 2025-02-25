import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LocationRepository } from './location.repository';

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
        'Ha ocurrido un error al obtener las coordenadas de la base de datos',
      );
    }
  }
}
