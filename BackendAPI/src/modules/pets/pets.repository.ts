import { InjectRepository } from "@nestjs/typeorm";
import { Pets } from "./entity/pets.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Users } from "../users/entity/users.entity";

@Injectable()
export class PetsRepository {
    constructor(
        @InjectRepository(Pets)
        private readonly petsRepository: Repository<Pets>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ){}

    async getPets(): Promise<Pets[]> {
        return await this.petsRepository.find({relations: ['user']})
    }

    async getPetById(id: string): Promise<Pets> {
        const petFound = await this.petsRepository.findOne({ where: { id }, relations: ['user'] })
        if(!petFound){
            throw new NotFoundException('La mascota no fue encontrada')
        }
        return petFound
    }

    async createNewPet(pet: Omit<Pets, 'id' | 'user' | 'userId' >, userId: string): Promise<Pets> {
        try {
            const user = await this.usersRepository.findOneBy({id: userId})
            if(!user){
                throw new NotFoundException('Usuario no ha sido encontrado')
            }
            const newPet = this.petsRepository.create({...pet, user: user})
            return await this.petsRepository.save(newPet)
          } catch (error) {
            console.error("Error al crear a la mascota:", error)
            throw new InternalServerErrorException('Registro fallido para la mascota')
          }
    }

    async updatePet(petId: string, pet: Partial<Pets>): Promise<Partial<Pets>> {
       const petFound = await this.petsRepository.findOneBy({id: petId})
       if(!petFound){
        throw new NotFoundException('La mascota no fue encontrada')
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