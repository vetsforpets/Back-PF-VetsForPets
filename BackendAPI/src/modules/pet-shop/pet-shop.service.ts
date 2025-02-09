import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PetShopRepository } from './pet-shop.repository';

@Injectable()
export class PetShopService {
    constructor(private readonly petShopRepository: PetShopRepository){}

    async find(){
        try {
            const petShops = await this.petShopRepository.find()
            return petShops
        } catch (error) {
            throw new NotFoundException('No se encontraron usuarios en la base de datos')
        }
    }
}
