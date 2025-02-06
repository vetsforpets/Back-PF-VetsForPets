import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entity/users.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UsersRepository {
    constructor( @InjectRepository(Users) private readonly usersRepository: Repository<Users>){}

    async getUsers(){
        const users = await this.usersRepository.find()
        return users
    }

    async getUserByEmail(email: string){
        const userfiltered = await this.usersRepository.findOne({where: {email}})
        if (!userfiltered) {
            throw new HttpException('El usuario no ha sido encontrado' , HttpStatus.NOT_FOUND)
        }
        return userfiltered
    }
}