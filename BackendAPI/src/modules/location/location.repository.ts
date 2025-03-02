import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entity/location.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as geolib from 'geolib';
import { CurrentLocationDto } from './dto/currentLocation.dto';
import { NotFoundException } from '@nestjs/common';
export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;
export type GeolibAltitudeInputValue = number;

export class LocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // async getCurrentLocation(
  //   lat: GeolibLatitudeInputValue,
  //   long: GeolibLongitudeInputValue,
  //   radius: number,
  // ): Promise<{ location: Location; distance: number }[]> {
  //   const currentLatitude = typeof lat === 'string' ? parseFloat(lat) : lat;
  //   const currentLongitude = typeof long === 'string' ? parseFloat(long) : long;

  //   const locations = await this.locationRepository.find();

  //   const nearbyLocations = locations
  //     .map((location) => {
  //       const locLat =
  //         typeof location.latitude === 'string'
  //           ? parseFloat(location.latitude)
  //           : location.latitude;
  //       const locLong =
  //         typeof location.longitude === 'string'
  //           ? parseFloat(location.longitude)
  //           : location.longitude;

  //       const distance = geolib.getDistance(
  //         { latitude: currentLatitude, longitude: currentLongitude },
  //         { latitude: locLat, longitude: locLong },
  //       );

  //       return { location, distance };
  //     })
  //     .filter((item) => item.distance <= radius)
  //     .sort((a, b) => a.distance - b.distance);
  //   return nearbyLocations;
  // }

  async save(location: Location | Location[]): Promise<Location | Location[]> {
    if (Array.isArray(location)) {
      return this.locationRepository.save(location);
    } else {
      return this.locationRepository.save(location);
    }
  }

  async find() {
    return await this.locationRepository.find();
  }

  async findLocationsArray() {
    return await this.locationRepository.find({ relations: { user: true } });
  }

  async findPetShopsLocations() {
    return await this.locationRepository.find({
      where: { petShop: Not(IsNull()) },
      relations: { petShop: true },
    });
  }

  // async findByDistance(center: CurrentLocationDto) {
  //   const locations = await this.locationRepository.find();
  //   if (locations.length === 0) {
  //     throw new NotFoundException(
  //       `No ser pudieron encontrar las ubicaciones de la base de datos`,
  //     );
  //   }

  //   const locationCoords = locations.map((loc) => ({
  //     lat:
  //       typeof loc.latitude === 'string'
  //         ? parseFloat(loc.latitude)
  //         : loc.latitude,
  //     lng:
  //       typeof loc.longitude === 'string'
  //         ? parseFloat(loc.longitude)
  //         : loc.longitude,
  //   }));
  //   const sorted = geolib.orderByDistance(center, locationCoords) as {
  //     lat: number;
  //     lng: number;
  //   }[];

  //   const nearestCord = sorted[0];

  //   const tolerance = 0.000001;

  //   const sortedLocations = locations.find((loc) => {
  //     const locLat = Number(loc.latitude);
  //     const locLng = Number(loc.longitude);
  //     return (
  //       Math.abs(locLat - nearestCord.lat) < tolerance &&
  //       Math.abs(locLng - nearestCord.lng) < tolerance
  //     );
  //   });
  //   return sortedLocations;
  // }
}
