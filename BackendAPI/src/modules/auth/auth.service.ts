import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
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
      if (!userDb || userDb.password !== password) {
        throw new HttpException('Credenciales invalidas', HttpStatus.NOT_FOUND);
      }

      const userPayload = {
        sub: userDb.id,
        id: userDb.id,
        email: userDb.email,
      };

      const token = this.jwtService.sign(userPayload);
      return { success: 'El usuario se ha logueado exitosamente', token };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Ha habido un error con su peticion, esta es la informacion del error: ${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
