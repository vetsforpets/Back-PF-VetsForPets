import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pets } from './entity/pets.entity';
import { CreatePetDto } from './dto/create.pet.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';

@ApiTags('Pets')
@UseGuards(RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las mascotas' })
  @ApiOkResponse({ description: 'Listado de mascotas' })
  @Admin()
  @Roles(Role.PETSHOP, Role.USER)
  async getAllPets(): Promise<Pets[]> {
    return this.petsService.getAllPets();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mascota por ID' })
  @ApiOkResponse({ description: 'Detalles de la mascota' })
  @Roles(Role.PETSHOP)
  async getPetById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Pets> {
    return this.petsService.getPetById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiCreatedResponse({
    description: 'La mascota ha sido creada con exito',
    type: Pets,
  })
  @ApiBody({ type: CreatePetDto })
  @Roles(Role.USER)
  async createNewPet(
    @Body() newPet: CreatePetDto,
    @Request() req,
  ): Promise<Partial<Pets>> {
    const userId = req.user.id;
    return this.petsService.createNewPet(newPet, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un mascota' })
  @ApiOkResponse({ description: 'La mascota ha sido actualizada con exito' })
  @ApiBody({ type: CreatePetDto })
  @Roles(Role.USER, Role.PETSHOP)
  async updatePet(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedPet: Partial<CreatePetDto>,
  ): Promise<Partial<Pets>> {
    return this.petsService.updatePet(id, updatedPet);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiOkResponse({ description: 'La mascota ha sido eliminada con exito' })
  @Roles(Role.USER)
  async deletePet(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.petsService.deletePet(id);
  }
}
