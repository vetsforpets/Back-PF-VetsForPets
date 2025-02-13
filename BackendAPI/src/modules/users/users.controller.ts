import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Users } from './entity/users.entity';
import {Request as ExpressRequest} from 'express'
import { UpdateUserDto } from './dto/update.user.dto';
import { PetsAssociatedException } from '../common/petAssociatedException';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({summary:'Obtener todos los usuarios'})
    @ApiOkResponse({description: 'Lista de usuarios'})
    @ApiUnauthorizedResponse({description:'No autorizado'})
    @ApiInternalServerErrorResponse({description:'Error interno del servidor'})
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllUsers(@Request() req: ExpressRequest & {user: Users}) {
        return this.usersService.getAllUsers()
    }

    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiOkResponse({ description: 'Usuario encontrado' })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getUserById(@Param('id', ParseUUIDPipe) id: string, @Request() req: ExpressRequest & { user: Users }) {
      console.log(req.user);
      return this.usersService.getUserById(id);
    }

    @ApiOperation({ summary: 'Actualizar usuario' })
    @ApiOkResponse({ description: 'Usuario actualizado' })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() userData: UpdateUserDto, @Request() req: ExpressRequest & { user: Users }) {
      console.log(req.user);
      return this.usersService.updateUser(id, userData);
    }

    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiOkResponse({ description: 'Usuario eliminado' })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    @ApiConflictResponse({ description: 'No se puede eliminar el usuario porque todavía tiene mascotas asociadas.',
    schema: { 
        $ref: getSchemaPath(PetsAssociatedException) 
    } }) 
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDPipe) id: string, @Request() req: ExpressRequest & { user: Users }) {
      console.log(req.user);
      return this.usersService.deleteUser(id);
    }

}
