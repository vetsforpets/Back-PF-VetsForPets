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
          error: `No se encontraron usuarios en la base de datos`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserById(userId: string) {
    try {
      return await this.usersRepository.findUserById(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No se encontro el usuario en la base de datos`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
