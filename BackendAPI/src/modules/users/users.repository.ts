import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entity/users.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsAssociatedException } from "../common/petAssociatedException";

@Injectable()
export class UsersRepository {
    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) { }

    async getUsers() {
        const users = await this.usersRepository.find({ relations: { userMembership: { membership: true } } })
        return users.map(({ password, ...user }) => {
            return user
        })
    }

    async getUserById(id: string): Promise<Users | null> {
        return this.usersRepository.findOne({ where: { id }, relations: ['pets'] })
    }

    async getUserByEmail(email: string) {
        const userfiltered = await this.usersRepository.findOne({ where: { email } })

        return userfiltered
    }

    async createNewUser(user: Users): Promise<Users>{
        const newUser = await this.usersRepository.create(user)
        await this.usersRepository.save(newUser)
        return this.usersRepository.findOne({where: {email: user.email}})
    }

    async updateUser(id: string, userData: Partial<Users>): Promise<Partial<Users>> {
        const user = await this.getUserById(id)
        if (!user) {
            return new NotFoundException('El usuario no fue encontrado')
        }
        Object.assign(user, userData)
        return this.usersRepository.save(user)
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const result = await this.usersRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Usuario no encontrado para eliminar`);
            }
        } catch (error) {
            if (error.code === '23503') {
                throw new PetsAssociatedException()
            }
            throw error
        }
    }
}