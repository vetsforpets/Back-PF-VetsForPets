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
  Put,
  Query,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { GoogleOauthGuard } from '../common/guards/google.0auth.guard';
import { Response } from 'express';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import { Admin } from 'src/decorators/roles/admin.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GoogleCallbackDto } from './dto/google.callback.dto';


@ApiTags('Auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Get('google/signIn')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {}

  @Public()
  @Post('google/callback')
  async googleRedirect(@Body() body: GoogleCallbackDto, @Res() res: Response) { 
    try {
      console.log('Authorization code:', body.code);
      if (!body.code) {
        throw new HttpException('Codigo de autorizacion no encontrado', HttpStatus.BAD_REQUEST);
      }

      const jwtGeneratedToken = await this.authService.exchangeCodeForToken(body.code);
      console.log('JWT generated:', jwtGeneratedToken);
      res.send(jwtGeneratedToken);
    } catch (err) {
      console.error('OAuth error:', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('signIn')
  @Public()
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
  @Public()
  async saveUser(@Body() newUser: SignUpUserDto) {
    return await this.authService.signUp(newUser);
  }


  @Post('vetSignUp')
  @Public()
  petShopSignUp(@Body() newPetShop: SignUpPetShopDto) {
    try {
      return this.authService.signUpPetShop(newPetShop);
    } catch (error) {
      throw new BadRequestException(
        'Ha habido un error con las crendeciales, por favor intente de nuevo',
      );
    }
  }

  @ApiBearerAuth()
  @Put('assignRole')
  @Admin()
  assignRole(@Query("id") id: string) {

    return this.authService.assignRole(id)

  }

  @ApiBearerAuth()
  @Put('assignAdmin')
  @Admin()
  assignAdmin(@Query("id") id: string) {

    return this.authService.assignAdmin(id)

  }
}
