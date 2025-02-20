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
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { GoogleOauthGuard } from '../common/google.0auth.guard';
import { Response } from 'express';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/signIn')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {}

  @Get('google/callback')
  async googleRedirect(@Req() req, @Res() res: Response) {
    try {
      const code = req.query.code as string;
      console.log('Authorization code:', code);
      if (!code) {
        throw new BadRequestException('Codigo de autorizacion no encontrado');
      }
      
      const jwtGeneratedToken = await this.authService.exchangeCodeForToken(code);
      console.log('JWT generated:', jwtGeneratedToken); 
      const redirectUrl = `${process.env.GOOGLE_CALLBACK_URL}/oauth?token=${jwtGeneratedToken.token}`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error('OAuth error:', err); 
      const errorRedirect = `${process.env.GOOGLE_CALLBACK_URL}/oauth/error?message=${encodeURIComponent(err.message)}`;
      res.redirect(errorRedirect);
    }
  }


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
