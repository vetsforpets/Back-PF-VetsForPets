import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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
import { Users } from '../users/entity/users.entity';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';
import axios from 'axios';
import { GoogleUserDto } from './dto/signup.google';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly petShopRepository: PetShopRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
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
    }
    return this.jwtService.sign(payload)
  }

  async exchangeCodeForToken(code: string): Promise<{ token: string }> {
    try {
      console.log('Exchanging code for token. Code:', code);
  
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_SECRET;
      const redirectUri = process.env.GOOGLE_CALLBACK_URL;
  
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      const userInfo = await this.getUserInfo(accessToken);
  
      const signedInUser = await this.oAuthSignIn(userInfo);
  
      const jwtToken = this.generateJwt(signedInUser);
  
      return { token: jwtToken };
    } catch (error) {

      if (axios.isAxiosError(error) && error.response) {
        console.error('OAuth Error Details:', error.response.data);
  
        if (error.response.data.error === 'invalid_grant') {
          throw new BadRequestException('Invalid authorization code or redirect URI.');
        } else if (error.response.data.error === 'invalid_client') {
          throw new UnauthorizedException('Invalid client credentials.');
        } else if (error.response.data.error === 'redirect_uri_mismatch') {
          throw new BadRequestException('Redirect URI mismatch.');
        }
      } else {
        console.error('General Error:', error);
      }
        throw new InternalServerErrorException('Failed to exchange code for token.');
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return userInfoResponse.data;
    } catch (error) {
      console.error(
        'Error en obtener la informacion del usuario:',
        error.response ? error.response.data : error.message,
      );
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async oAuthSignIn(oAuthUser: GoogleUserDto) { 
    if (!oAuthUser || !oAuthUser.email || !oAuthUser.given_name || !oAuthUser.family_name) {
      throw new BadRequestException('Invalid user information from Google.');
    }
    try {
      let user = await this.usersRepository.getUserByEmail(oAuthUser.email);
      if (!user) {
        const newUser = new Users();
        newUser.email = oAuthUser.email;
        newUser.name = oAuthUser.given_name;
        newUser.lastName = oAuthUser.family_name || "";
        newUser.imgProfile = oAuthUser.picture || null;
        user = await this.usersRepository.createNewUser(newUser);
      }
      return user;
    } catch (error) {
      console.error('Error in oAuthSignIn:', error);
      throw new InternalServerErrorException('Error during OAuth sign-in.');
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
}
