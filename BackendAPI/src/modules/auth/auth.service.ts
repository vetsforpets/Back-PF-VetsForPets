import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignUpUserDto } from './dto/signup.user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    
    try {
      const userDb = await this.usersRepository.getUserByEmail(email);
      if (!userDb) {
        throw new BadRequestException('Credenciales invalidas');
      }

      if (!password || !userDb.password) {
        throw new Error('Password or stored hash is missing');
      }

      const isPasswordMatching = await bcrypt.compare(password, userDb.password);
      if (!isPasswordMatching) {
        throw new BadRequestException('Credenciales invalidas');
      }

      const userPayload = {
        sub: userDb.id,
        id: userDb.id,
        email: userDb.email,
      };

      const token = this.jwtService.sign(userPayload);
      return { success: 'El usuario se ha logueado exitosamente', token };
    } catch (error) {
      throw new BadRequestException('Ha habido un error en el servidor');
    }

  }

  async signUp(newUser: SignUpUserDto) {
    try {
        if(newUser.password !== newUser.confirmPassword) {
            throw new BadRequestException('Las contraseñas no coinciden.');
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 10)
        if(!hashedPassword) {
            throw new BadRequestException('No se pudo encriptar la contraseña.')
        }
        await this.usersRepository.createNewUser({...newUser, password: hashedPassword})
        return {success: 'Usuario registrado exitosamente.'}
    } catch (error) {

        if (error instanceof BadRequestException) {
            throw error; 
        }

        throw new InternalServerErrorException('Ocurrió un error inesperado durante el registro.')
    }
}
}
