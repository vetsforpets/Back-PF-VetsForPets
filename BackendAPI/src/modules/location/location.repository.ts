import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entity/location.entity';
import { Repository } from 'typeorm';
import * as geolib from 'geolib';
export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;
export type GeolibAltitudeInputValue = number;

export class LocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getCurrentLocation(
    lat: GeolibLatitudeInputValue,
    long: GeolibLongitudeInputValue,
    radius: number,
  ): Promise<{ location: Location; distance: number }[]> {
    const currentLatitude = typeof lat === 'string' ? parseFloat(lat) : lat;
    const currentLongitude = typeof long === 'string' ? parseFloat(long) : long;

    const locations = await this.locationRepository.find();

    const nearbyLocations = locations
      .map((location) => {
        const locLat =
          typeof location.latitude === 'string'
            ? parseFloat(location.latitude)
            : location.latitude;
        const locLong =
          typeof location.longitude === 'string'
            ? parseFloat(location.longitude)
            : location.longitude;

        const distance = geolib.getDistance(
          { latitude: currentLatitude, longitude: currentLongitude },
          { latitude: locLat, longitude: locLong },
        );

        return { location, distance };
      })
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    return nearbyLocations;
  }

  async save(location: Location): Promise<Location> {
    return await this.locationRepository.save(location);
  }

  async find() {
    return await this.locationRepository.find();
  }

  async findBy(id: string) {
    return await this.locationRepository.findOne({ where: { id } });
  }
}
