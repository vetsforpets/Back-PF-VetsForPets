import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignUpUserDto } from './dto/signup.user.dto';
import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UsersRepository
    ){}

    async signUp(newUser: SignUpUserDto) {
        try {
            if(newUser.password !== newUser.confirmPassword) {
                throw new BadRequestException('Las contraseñas no coinciden.');
            }
            const hashedPassword = await bycrypt.hash(newUser.password, 10)
            if(!hashedPassword) {
                throw new BadRequestException('No se pudo encriptar la contraseña.')
            }
            await this.userRepository.createNewUser({...newUser, password: hashedPassword})
            return {success: 'Usuario registrado exitosamente.'}
        } catch (error) {

            if (error instanceof BadRequestException) {
                throw error; 
            }

            throw new InternalServerErrorException('Ocurrió un error inesperado durante el registro.')
        }
    }
}
