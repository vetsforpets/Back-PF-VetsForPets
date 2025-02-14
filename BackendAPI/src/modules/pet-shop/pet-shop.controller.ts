import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PetShopService } from './pet-shop.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PetShop } from './entity/pet-shop.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePetShopDto } from './dto/updatePetShop.dto';

@ApiTags('PetShop')
@Controller('petshop')
export class PetShopController {
  constructor(private readonly petShopService: PetShopService) {}

  @ApiOperation({ summary: 'Obtener todas las veterinarias' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarias' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPetshops(): Promise<PetShop[]> {
      return await this.petShopService.getAllPetShops();
  }

  @ApiOperation({ summary: 'Obtener una veterinaria por ID' })
  @ApiResponse({ status: 200, description: 'Veterinaria encontrada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findPetShopById(@Param('id') id: string): Promise<PetShop> {
    try {
      return await this.petShopService.getPetShopById(id);
    } catch (error) {
      console.error("Error en controlador findPetShopById:", error);
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Error al obtener la veterinaria.')
    }
  }

  @ApiOperation({ summary: 'Actualizar una veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria actualizada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePetShop(@Param('id') id: string, @Body() petShopData: UpdatePetShopDto): Promise<PetShop | undefined> {
    try {
      return await this.petShopService.updatePetShop(id, petShopData)
    } catch (error) {
      console.error("Error en controlador updatePetShop:", error)
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la veterinaria.');
    }
  }

  @ApiOperation({ summary: 'Eliminar una veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria eliminada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePetShop(@Param('id') id: string): Promise<void> {
    try {
      return await this.petShopService.deletePetShop(id);
    } catch (error) {
      console.error("Error en controlador deletePetShop:", error);
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Error al eliminar la veterinaria.')
    }
  }
}
