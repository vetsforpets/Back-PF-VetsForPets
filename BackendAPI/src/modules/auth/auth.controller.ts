import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
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
  @Post('signup')
  async saveUser(@Body() newUser: SignUpUserDto) {
    return await this.authService.signUp(newUser);
  }
}
