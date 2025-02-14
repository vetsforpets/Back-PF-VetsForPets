import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async getAllUsers() {
    try {
      return await this.usersRepository.getUsers();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al obtener los usuarios. Inténtelo de nuevo más tarde.`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.usersRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado')
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }
      console.error(error)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error al obtener el usuario. Inténtelo de nuevo más tarde.`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<Partial<Users>> {
    try {
      return await this.usersRepository.updateUser(id, userData)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error(error)
      throw new InternalServerErrorException('Error al actualizar el usuario. Verifique los datos ingresados.')
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      return await this.usersRepository.deleteUser(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el usuario.')
    }
  }

}


