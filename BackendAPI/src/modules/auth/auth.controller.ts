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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { GoogleOauthGuard } from '../common/guards/google.0auth.guard';
import { Response } from 'express';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import { Admin } from 'src/decorators/roles/admin.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GoogleCallbackDto } from './dto/google.callback.dto';

@ApiTags('Authentications')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/signIn')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Redirigir a Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirigir a Google' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {}

  @Public()
  @Post('google/callback')
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiOkResponse({ description: 'Token JWT retornado' })
  @ApiBadRequestResponse({ description: 'Código de autorización no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error de OAuth' })
  async googleRedirect(@Body() body: GoogleCallbackDto, @Res() res: Response) {
    try {
      console.log('Código de autorización:', body.code);
      if (!body.code) {
        throw new HttpException('Código de autorización no encontrado', HttpStatus.BAD_REQUEST);
      }

      const jwtGeneratedToken = await this.authService.exchangeCodeForToken(body.code);
      console.log('JWT generado:', jwtGeneratedToken);
      res.send(jwtGeneratedToken);
    } catch (err) {
      console.error('Error de OAuth:', err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('signIn')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiOkResponse({ description: 'Usuario inició sesión correctamente' })
  @ApiBadRequestResponse({ description: 'Credenciales inválidas' })
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

  @Public()
  @Post('signUp')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiCreatedResponse({ description: 'Usuario creado correctamente' })
  async saveUser(@Body() newUser: SignUpUserDto) {
    return await this.authService.signUp(newUser);
  }

  @Public()
  @Post('vetSignUp')
  @ApiOperation({ summary: 'Registrar tienda de mascotas' })
  @ApiCreatedResponse({ description: 'Veterinaria creada correctamente' })
  @ApiBadRequestResponse({ description: 'Credenciales inválidas' })
  petShopSignUp(@Body() newPetShop: SignUpPetShopDto) {
    try {
      return this.authService.signUpPetShop(newPetShop);
    } catch (error) {
      throw new BadRequestException(
        'Ha habido un error con las credenciales, por favor intente de nuevo',
      );
    }
  }

  @ApiBearerAuth()
  @Put('assignRole')
  @Admin()
  @ApiOperation({ summary: 'Asignar rol a usuario' })
  @ApiOkResponse({ description: 'Rol asignado correctamente' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiQuery({ name: 'id', description: 'ID de usuario', required: true })
  assignRole(@Query('id') id: string) {
    return this.authService.assignRole(id);
  }

  @ApiBearerAuth()
  @Put('assignAdmin')
  @Admin()
  @ApiOperation({ summary: 'Asignar rol de administrador a usuario' })
  @ApiOkResponse({ description: 'Rol de administrador asignado correctamente' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiQuery({ name: 'id', description: 'ID de usuario', required: true })
  assignAdmin(@Query('id') id: string) {
    return this.authService.assignAdmin(id);
  }
}