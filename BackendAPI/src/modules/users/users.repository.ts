import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entity/users.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) { }

    async getUsers() {
        const users = await this.usersRepository.find({ relations: { userMembership: { membership: true } } })


        return users.map(({ password, ...user }) => {
            return user
        })
    }

    async getUserByEmail(email: string) {
        const userfiltered = await this.usersRepository.findOne({ where: { email } })

        return userfiltered
    }

    async createNewUser(user: Partial<Users>): Promise<Partial<Users>> {
        const newUser = await this.usersRepository.save(user)
        return newUser
    }

    async findUserById(id: string):Promise<Users | null>{
        return this.usersRepository.findOne({where:{id}})
    }
}