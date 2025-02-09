import { InjectRepository } from "@nestjs/typeorm";
import { Pets } from "./entity/pets.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

@Injectable()
export class PetsRepository {
    constructor(
        @InjectRepository(Pets)
        private readonly petsRepository: Repository<Pets>,
    ){}

    async getPets(): Promise<Pets[]> {
        return await this.petsRepository.find()
    }

    async getPetById(id: string): Promise<Pets> {
        const petFound = await this.petsRepository.findOneBy({id})
        if(!petFound){
            throw new NotFoundException('Pet was not found')
        }
        return petFound
    }

    async createNewPet(pet: Pets): Promise<Pets> {
        try {
            const newPet = this.petsRepository.create(pet)
            return await this.petsRepository.save(newPet)
          } catch (error) {
            console.error("Error al crear a la mascota:", error)
            throw new InternalServerErrorException('Registro fallido para la mascota')
          }
    }

    async updatePet(petId: string, pet: Partial<Pets>): Promise<Partial<Pets>> {
       const petFound = await this.petsRepository.findOneBy({id: petId})
       if(!petFound){
        throw new NotFoundException('Product not found')
    }
    await this.petsRepository.update({id: petId}, pet)
    const updatedPet = await this.petsRepository.findOneBy({id: petId})
    return updatedPet
    }

    async deletePet(petId: string) {
        const productFound = await this.petsRepository.findOneBy({id: petId})
        if(!productFound){
            throw new NotFoundException('La mascota no ha sido encontrada')
        }
        await this.petsRepository.delete(petId)
        return 'La mascota ha sido eliminada'
    }
}