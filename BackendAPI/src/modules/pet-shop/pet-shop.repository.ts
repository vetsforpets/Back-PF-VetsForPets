import { InjectRepository } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Repository } from 'typeorm';
import { PetShopDto } from './dto/signUpPetshop.dto';
import { BadRequestException } from '@nestjs/common';
import moment from 'moment';

export class PetShopRepository {
  constructor(
    @InjectRepository(PetShop)
    private readonly petshopRepository: Repository<PetShop>,
  ) {}

  async find() {
    const petshops = await this.petshopRepository.find();
    return petshops
  }

  async getPetShopByEmail(email: string){
    const petshopFiltered = await this.petshopRepository.findOne({where: {email}})
    if (!petshopFiltered) {
      throw new BadRequestException('No se ha encontrado a esta veterinaria, por favor revise nuevamente')
    }
  }

  async save(petshopDto: PetShop): Promise <Omit<PetShop,'id'> | PetShopDto>{
    petshopDto.createdAt = new Date().toLocaleDateString()
    const petshopUser = await this.petshopRepository.save(petshopDto)
    return petshopUser
  }
}
