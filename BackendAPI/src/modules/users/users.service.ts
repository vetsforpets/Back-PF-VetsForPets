import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UpdateUserDto } from './dto/update.user.dto';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService
  ) { }

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

      const { password, ...rest } = user

      return rest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
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
      const updatedUser = await this.usersRepository.updateUser(id, userData);
      if (updatedUser) {
        try {
          const emailDto: sendEmailDto = {
            recipients: updatedUser.email,
            subject: 'Actualización de tu perfil en VetsForPets',
            html: `
              <p>¡Hola ${updatedUser.name}!</p>
              <p>Tu perfil en VetsForPets ha sido actualizado exitosamente.</p>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <p>Atentamente,<br>El equipo de VetsForPets</p>
            `}
          await this.emailService.sendEmail(emailDto);
        } catch (emailError) {
          console.error('Error al enviar el email de actualización:', emailError);
        }
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el usuario. Verifique los datos ingresados.',
      );
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


