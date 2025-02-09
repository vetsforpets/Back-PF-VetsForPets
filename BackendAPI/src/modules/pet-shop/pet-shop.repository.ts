import { InjectRepository } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Repository } from 'typeorm';
import { PetShopDto } from './dto/signUpPetshop.dto';


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
    return petshopFiltered
  }

  async save(petshopDto: PetShopDto){
    const petshopUser = await this.petshopRepository.save(petshopDto)
    return petshopUser
  }
}
