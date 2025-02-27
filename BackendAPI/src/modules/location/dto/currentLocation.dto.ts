export type GeolibLongitudeInputValue = number | string;
export type GeolibLatitudeInputValue = number | string;
export class CurrentLocationDto {
    latitude: GeolibLatitudeInputValue
    longitude: GeolibLongitudeInputValue
    radius: number
}