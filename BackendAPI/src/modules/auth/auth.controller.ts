import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  BadRequestException,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup.user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpPetShopDto } from '../pet-shop/dto/signUpPetshop.dto';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import { Admin } from 'src/decorators/roles/admin.decorator';
import { RolesGuard } from '../common/guards/roles.guard';


@ApiTags('Auth')
@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) { }


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
      return this.authService.petShopSignUp(newPetShop);
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
