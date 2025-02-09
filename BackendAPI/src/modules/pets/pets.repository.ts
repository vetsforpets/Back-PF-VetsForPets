import { InjectRepository } from "@nestjs/typeorm";
import { Pets } from "./entity/pets.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
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
        return await this.petsRepository.find()
    }

    async getPetById(id: string): Promise<Pets> {
        const petFound = await this.petsRepository.findOneBy({id})
        if(!petFound){
            throw new NotFoundException('Pet was not found')
        }
        return petFound
    }

    async createNewPet(pet: Pets, userId: string): Promise<Pets> {
        const user = await this.usersRepository.findOne(
            {where: {id: userId}}
        )
        if(!user){
            throw new NotFoundException('Usuario no encontrado')
        }
        pet.user = user
        return await this.petsRepository.save(pet)
    }
}