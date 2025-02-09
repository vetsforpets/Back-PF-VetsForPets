import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PetsRepository } from './pets.repository';
import { CreatePetDto } from './dto/create.pet.dto';
import { Pets } from './entity/pets.entity';

@Injectable()
export class PetsService {
    constructor(
        private readonly petsRepository: PetsRepository
    ){}

    async getAllPets(): Promise<Pets[]> {
        return await this.petsRepository.getPets()
    }

    async getPetById(id: string): Promise<Pets>{
            const pet = await this.petsRepository.getPetById(id)
            if(!pet){
                throw new NotFoundException('Mascota no encontrada')
            }
            return pet
    }

    async createNewPet(pet:CreatePetDto, userId: string): Promise<Pets> {
        try {
            const newPet = new Pets()
            newPet.name = pet.name 
            newPet.age = pet.age
            newPet.type = pet.type
            newPet.dateOfBirth = pet.dateOfBirth
            newPet.profileImg = pet.profileImg
            const registeredPet = await this.petsRepository.createNewPet(newPet, userId)
            return registeredPet 
        } catch (error) {
            console.error("Error al crear la mascota:", error)
            throw new Error('Error al crear la mascota en la base de datos.')      
        }
    }
}
