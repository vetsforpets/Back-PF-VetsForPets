import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignUpUserDto } from './dto/signup.user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { PetShopRepository } from '../pet-shop/pet-shop.repository';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';
import { Role } from '../common/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly petShopRepository: PetShopRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(Users) private readonly usersDbRepository: Repository<Users>,
    @InjectRepository(PetShop) private readonly petshopDbRepository: Repository<PetShop>
  ) { }

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersRepository.getUserByEmail(email)
      if (user && await bcrypt.compare(password, user.password)) {
        const token = this.generateJwt(user)
        return { success: 'El usuario se ha logueado exitosamente', user, token }
      }

      const petShop = await this.petShopRepository.getPetShopByEmail(email)
      if (petShop && await bcrypt.compare(password, petShop.password)) {
        const token = this.generateJwt(petShop)
        return { success: 'El usuario se ha logueado exitosamente', user: petShop, token }
      }
      throw new UnauthorizedException('Credenciales inválidas');

    } catch (error) {
      console.error("Error en signIn:", error);
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  generateJwt(user: Users | PetShop): string {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user instanceof Users ? 'user' : 'petShop',
      role: user.role,
      isAdmin: user.isAdmin
    }
    return this.jwtService.sign(payload)
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

      const userEntity = new Users();
      userEntity.email = newUser.email;
      userEntity.name = newUser.name;
      userEntity.lastName = newUser.lastName;
      userEntity.password = hashedPassword;
      userEntity.age = newUser.age;
      userEntity.phoneNumber = newUser.phoneNumber;
      userEntity.imgProfile = newUser.imgProfile;

      await this.usersRepository.createNewUser(userEntity);

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
      const existingPetshopEmailFound = await this.petShopRepository.getPetShopByEmail(
        newPetShop.email,
      );
      const existingUserEmailFound = await this.usersRepository.getUserByEmail(
        newPetShop.email
      )

      if (existingPetshopEmailFound || existingUserEmailFound) {
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


  async assignRole(userId: string) {

    const user = await this.petShopRepository.getPetShopById(userId);

    if (!user) throw new NotFoundException("ID de usuario inválido")

    if (user.role === Role.USER) {
      user.role = Role.PETSHOP
      await this.petshopDbRepository.save(user)
    } else {
      throw new BadRequestException("Este usuario ya es veterinario!")
    }

    return { message: "Rol de veterinario asignado con éxito!" }
  }


  async assignAdmin(userId: string) {
    const user = await this.usersDbRepository.findOne({ where: { id: userId }, })

    if (!user) throw new NotFoundException("ID de usuario inválido")

    if (user.isAdmin) {
      user.isAdmin = false
      await this.usersDbRepository.save(user)

      return { message: `Se han quitado los permisos de administrador al usuario ${user.name}`, isAdmin: user.isAdmin }
    }

    user.isAdmin = true

    await this.usersDbRepository.save(user)

    return { message: `Se han otorgado permisos de administrador al usuario ${user.name}!`, isAdmin: user.isAdmin }
  }


}
