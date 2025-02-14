import { HttpException, HttpStatus } from '@nestjs/common';

export class PetsAssociatedException extends HttpException {
  constructor() {
    super('No se puede eliminar el usuario porque todavía tiene mascotas asociadas.', HttpStatus.CONFLICT)
  }
}