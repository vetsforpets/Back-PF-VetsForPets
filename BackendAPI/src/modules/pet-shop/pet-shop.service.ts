import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PetShopRepository } from './pet-shop.repository';
import { PetShop } from './entity/pet-shop.entity';
import { SignUpPetShopDto } from './dto/signUpPetshop.dto';
import { UpdatePetShopDto } from './dto/updatePetShop.dto';

@Injectable()
export class PetShopService {
    constructor(private readonly petShopRepository: PetShopRepository){}

    async getAllPetShops():Promise<PetShop[]>{
            const petShops = await this.petShopRepository.getAllPetshops()
            return petShops
    }

    async getPetShopById(id:string):Promise<PetShop> {
        try {
            return await this.petShopRepository.getPetShopById(id)
        } catch (error) {
            console.error('Error al encontrar la veterinaria:', error)
            if(error instanceof NotFoundException){
                throw error
            }
            throw new InternalServerErrorException('Se genero un error al obtener la veterinaria en la base de datos')
        }
    }

    async createNewPetshop(petShopData:  SignUpPetShopDto): Promise<PetShop>{
        try {
            return await this.petShopRepository.savePetshop(petShopData)
        } catch (error) {
            console.error('Error en la creacion de la veterinaria', error)
            throw new InternalServerErrorException('Se genero un error al crear la veterinaria en la base de datos')
        }
    }

    async updatePetShop(id: string, petShopData: UpdatePetShopDto): Promise<PetShop | undefined>{
        try {
            return await this.petShopRepository.updatePetshop(id, petShopData)
        } catch (error) {
            console.error('Error en la actualizacion de la veterinaria', error)
            throw new InternalServerErrorException
        }
    }

    async deletePetShop(id:string): Promise<void>{
        try {
            await this.petShopRepository.deletePetshop(id)
        } catch (error) {
            console.error("Error en la eliminacion de la veterinaria:", error)
            if(error instanceof NotFoundException){
                throw error
            }
            throw new InternalServerErrorException('Se genero un error al eliminar la veterinaria en la base de datos')
        }   
    }
}
