import { BadRequestException, Controller, Get } from '@nestjs/common';
import { PetShopService } from './pet-shop.service';

@Controller('petshop')
export class PetShopController {
  constructor(private readonly petShopService: PetShopService) {}

  @Get()
  findAllUsers() {
    try {
      const users = this.petShopService.find();
      return users;
    } catch (error) {
        throw new BadRequestException('Hubo un error con su peticion del lado del servidor')
    }
  }
}
