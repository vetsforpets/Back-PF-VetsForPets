import { UsersRepository } from "../users/users.repository";

export class AuthRepository {
    constructor(private readonly usersRepository: UsersRepository){}
}