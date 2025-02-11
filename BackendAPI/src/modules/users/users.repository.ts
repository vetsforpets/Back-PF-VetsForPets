import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entity/users.entity";
import { Repository } from "typeorm";

export class UsersRepository {
    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) { }

    async getUsers() {
        const users = await this.usersRepository.find({ relations: { userMembership: { membership: true } } })
        return users
    }

    async getUserByEmail(email: string) {
        const userfiltered = await this.usersRepository.findOne({ where: { email } })
        return userfiltered
    }

    async createNewUser(user: Partial<Users>): Promise<Partial<Users>> {
        const newUser = await this.usersRepository.save(user)
        return newUser
    }
}