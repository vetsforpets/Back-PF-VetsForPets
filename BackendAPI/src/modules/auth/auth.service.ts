import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignUpUserDto } from './dto/signup.user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { PetShopRepository } from '../pet-shop/pet-shop.repository';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly petShopRepository: PetShopRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async signIn(email: string, password: string) {
    try {
      const userDb =
        (await this.usersRepository.getUserByEmail(email)) ||
        (await this.petShopRepository.getPetShopByEmail(email));
      if (!userDb) {
        throw new BadRequestException('Credenciales invalidas');
      }

      const isPasswordMatching = await bcrypt.compare(
        password,
        userDb.password,
      );
      if (!isPasswordMatching) {
        throw new BadRequestException('Credenciales invalidas');
      }

      const userPayload = {
        sub: userDb.id,
        id: userDb.id,
        email: userDb.email,
        isVet: userDb.isVet
      };

      const token = this.jwtService.sign(userPayload);
      return { success: 'El usuario se ha logueado exitosamente', token };
    } catch (error) {
      throw new BadRequestException('Ha habido un error en el servidor');
    }
  }

  async signUp(newUser: SignUpUserDto) {
    try {
      const emailFound = await this.usersRepository.getUserByEmail(
        newUser.email,
      );
      if (emailFound) {
        throw new BadRequestException(
          'El correo electronico ya esta registrado',
        );
      }
      if (newUser.password !== newUser.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden.');
      }
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      if (!hashedPassword) {
        throw new BadRequestException('No se pudo encriptar la contraseña.');
      }
      await this.usersRepository.createNewUser({
        ...newUser,
        password: hashedPassword,
      });

      const { password, confirmPassword, ...userWithOutPassword } = newUser;
      try {
        const emailDto: sendEmailDto = {
          recipients: newUser.email,
          subject: '¡Bienvenido(a) a VetsForPets!', 
          html: `
            <p>¡Hola ${newUser.name}!</p>  
            <p>¡Gracias por registrarte en VetsForPets!</p>
            <p>¡Esperamos verte pronto!</p>
            <p>Atentamente,<br>El equipo de VetsForPets</p>
          `, 
        };
        await this.emailService.sendEmail(emailDto)
      } catch (error) {
        console.error("Error al enviar el email:", error);
      }
      return {
        success: 'Usuario registrado exitosamente:',
        userWithOutPassword,
      };
    } catch (error) {
      console.error('Error en la creacion del usuario: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocurrió un error inesperado durante el registro.',
      );
    }
  }

  async petShopSignUp(newPetShop: SignUpPetShopDto) {
    try {
      const emailFound = await this.petShopRepository.getPetShopByEmail(
        newPetShop.email,
      );

      if (emailFound) {
        throw new BadRequestException(
          'El correo electronico ya esta registrado',
        );
      }

      if (newPetShop.password !== newPetShop.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden.');
      }

      const hashedPassword = await bcrypt.hash(newPetShop.password, 10);
      if (!hashedPassword) {
        throw new BadRequestException('No se pudo encriptar la contraseña.');
      }

      await this.petShopRepository.savePetshop({
        ...newPetShop,
        password: hashedPassword,

      });

      const { password, confirmPassword, ...petShopWithOutPassword } =
        newPetShop;

      try {
        const emailDto: sendEmailDto = {
          recipients: newPetShop.email,
          subject: '¡Bienvenido(a) a VetsForPets!', 
          html: `
            <p>¡Hola ${newPetShop.name}!</p>
            <p>¡Gracias por registrar tu veterinaria/petShop en VetsForPets!</p>
            <p>¡Esperamos verte pronto!</p>
            <p>Atentamente,<br>El equipo de VetsForPets</p>
          `}
          await this.emailService.sendEmail(emailDto)
      } catch (error) {
        console.error('Error al enviar el email:', error)
      }
      return {
        success: 'La veterinaria/petshop ha sido creada exitosamente: ',
        petShopWithOutPassword,
      };
    } catch (error) {
      console.error('Error durante la creacion del usuario:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocurrió un error inesperado durante el registro.',
      );
    }
  }
}
