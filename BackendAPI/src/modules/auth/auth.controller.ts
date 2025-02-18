import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  BadRequestException,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'Express';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';


@ApiTags('Auth')
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

  @Post('signUp')
  async saveUser(@Body() newUser: SignUpUserDto) {
    return await this.authService.signUp(newUser);
  }

  @Post('vetSignUp')
  petShopSignUp(@Body() newPetShop: SignUpPetShopDto) {
    try {
      return this.authService.petShopSignUp(newPetShop);
    } catch (error) {
      throw new BadRequestException(
        'Ha habido un error con las crendeciales, por favor intente de nuevo',
      );
    }
  }
}
