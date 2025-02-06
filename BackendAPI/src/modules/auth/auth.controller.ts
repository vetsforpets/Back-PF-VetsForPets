<<<<<<< HEAD
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signIn')
  signIn(@Body() loginDTO: LoginDTO) {
    try {
      return this.authService.signIn(loginDTO.email, loginDTO.password);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Ha habido un error con las credenciales, por favor intente de nuevo`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
=======
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('signup')
    async saveUser(@Body() newUser: SignUpUserDto) {
        return await this.authService.signUp(newUser)
    }
>>>>>>> 02e6eb1ee0a27755338ff48498f9233d63c4a687
}
