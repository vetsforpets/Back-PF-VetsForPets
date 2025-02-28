import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PetShopService } from './pet-shop.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PetShop } from './entity/pet-shop.entity';
import { UpdatePetShopDto } from './dto/updatePetShop.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('PetShop')
@UseGuards(RolesGuard)
@Controller('petshop')
export class PetShopController {
  constructor(private readonly petShopService: PetShopService) {}

  @ApiOperation({ summary: 'Obtener todas las veterinarias' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarias' })
  @ApiBearerAuth()
  @Admin()
  @Get()
  async getAllPetshops(): Promise<PetShop[]> {
    return await this.petShopService.getAllPetShops();
  }

  @ApiOperation({ summary: 'Obtener una veterinaria por ID' })
  @ApiResponse({ status: 200, description: 'Veterinaria encontrada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @Admin()
  @Roles(Role.PETSHOP)
  @Get(':id')
  async findPetShopById(@Param('id') id: string): Promise<PetShop> {
    try {
      return await this.petShopService.getPetShopById(id);
    } catch (error) {
      console.error('Error en controlador findPetShopById:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al obtener la veterinaria.',
      );
    }
  }

  @ApiOperation({ summary: 'Actualizar una veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria actualizada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @Roles(Role.PETSHOP)
  @Put(':id')
  async updatePetShop(
    @Param('id') id: string,
    @Body() petShopData: UpdatePetShopDto,
  ): Promise<PetShop | undefined> {
    try {
      return await this.petShopService.updatePetShop(id, petShopData);
    } catch (error) {
      console.error('Error en controlador updatePetShop:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar la veterinaria.',
      );
    }
  }

  @ApiOperation({ summary: 'Eliminar una veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria eliminada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @Admin()
  @Delete(':id')
  async deletePetShop(@Param('id') id: string): Promise<void> {
    try {
      return await this.petShopService.deletePetShop(id);
    } catch (error) {
      console.error('Error en controlador deletePetShop:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al eliminar la veterinaria.',
      );
    }
  }
}
