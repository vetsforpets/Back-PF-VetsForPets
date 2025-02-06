import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entity/users.entity";
import { Repository } from "typeorm";
import {NotFoundException } from "@nestjs/common";

export class UsersRepository {
    constructor( @InjectRepository(Users) private readonly usersRepository: Repository<Users>){}

    async getUsers(){
        const users = await this.usersRepository.find()
        return users
    }

    async getUserByEmail(email: string){
        const userfiltered = await this.usersRepository.findOne({where: {email}})
        if (!userfiltered) {
            throw new NotFoundException('El usuario no pudo ser encontrado')
        }
        return userfiltered
    }

    async createNewUser(user: Partial<Users>): Promise<Partial<Users>> {
        const newUser = await this.usersRepository.save(user)
        return newUser
    }
}