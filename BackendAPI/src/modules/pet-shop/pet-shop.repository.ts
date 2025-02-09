import { InjectRepository } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Repository } from 'typeorm';

export class PetShopRepository {
  constructor(
    @InjectRepository(PetShop)
    private readonly petshopRepository: Repository<PetShop>,
  ) {}

  async find() {
    const petshops = await this.petshopRepository.find();
  }
}
