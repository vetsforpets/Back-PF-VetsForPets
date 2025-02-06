import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers() {
    try {
      return await this.usersRepository.getUsers();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No users in found in the db`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
