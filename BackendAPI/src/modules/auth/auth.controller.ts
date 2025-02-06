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
          error: `There was an issue with the credentials, please check and try again`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
