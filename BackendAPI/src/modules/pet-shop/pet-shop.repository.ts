import { InjectRepository } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Location } from '../location/entity/location.entity';

export class PetShopRepository {
  constructor(
    @InjectRepository(PetShop)
    private readonly petshopRepository: Repository<PetShop>,
  ) { }

  async getAllPetshops(): Promise<PetShop[]> {
    try {
      return await this.petshopRepository.find({
        select: [
          'id',
          'name',
          'veterinarian',
          'email',
          'phoneNumber',
          'imgProfile',
          'is24Hours',
          'location',
          'licenseNumber',
          'foundation',
          'role',
          'businessHours',
        ],
        relations: ['location'],
      });
    } catch (error) {
      console.error('Error en la carga de veterinarias', error);
      throw new InternalServerErrorException(
        'Se generó un error al obtener las veterinarias en la base de datos.',
      );
    }
  }

  async getPetShopById(id: string): Promise<PetShop> {
    const petShopFound = await this.petshopRepository.findOne({
      where: { id },
      relations: ['location'],
    });
    if (!petShopFound) {
      throw new NotFoundException('Veterinaria no encontrada');
    }
    return petShopFound;
  }

  async getPetShopByEmail(email: string) {
    try {
      const petshopFiltered = await this.petshopRepository.findOne({
        where: { email },
      });
      return petshopFiltered;
    } catch (error) {
      console.error('Error al conseguir la veterinaria:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Se generó un error al obtener la veterinaria en la base de datos.',
      );
    }
  }

  async savePetshop(petshopData: PetShop): Promise<PetShop> {
    try {
      const newPetshop = this.petshopRepository.create(petshopData);
      return await this.petshopRepository.save(newPetshop);
    } catch (error) {
      console.error('Error en la creacion de la veterinaria:', error);
      throw new InternalServerErrorException(
        'Se genero un error al crear la veterinaria en la base de datos.',
      );
    }
  }

  async updatePetshop(
    id: string,
    petshopData: Partial<PetShop>,
  ): Promise<Partial<PetShop>> {
    try {
      const existingPetShop = await this.getPetShopById(id);
      if (!existingPetShop) {
        throw new NotFoundException('Petshop not found');
      }

      if (petshopData.email) {
        const emailPetShop = await this.getPetShopByEmail(petshopData.email);
        if (emailPetShop && emailPetShop.id !== id) {
          throw new ConflictException('El correo electrónico ya está en uso.');
        }
      }

      if (petshopData.location) {
        const locationEntities: Location[] = petshopData.location.map(
          (locData) => {
            const loc = new Location();
            loc.latitude = locData.latitude;
            loc.longitude = locData.longitude;
            return loc;
          },
        );
        existingPetShop.location = locationEntities;
      }

      Object.assign(existingPetShop, petshopData);

      const savedPetShop = await this.petshopRepository.save(existingPetShop);
      const { password, ...petShopWithoutPassword } = savedPetShop;
      return petShopWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error al actualizar la veterinaria:', error);
      throw new InternalServerErrorException(
        `Se generó un error al actualizar la veterinaria en la base de datos: ${error.message}`,
      );
    }
  }
  async deletePetshop(id: string): Promise<void> {
    try {
      const petShop = await this.getPetShopById(id);
      if (!petShop) {
        throw new NotFoundException(
          'Veterinaria no encontrada para desactivar.',
        );
      }

      petShop.isActive = false;
      await this.petshopRepository.save(petShop);
    } catch (error) {
      console.error('Error en eliminar una veterinaria:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Se generó un error al eliminar la veterinaria en la base de datos.',
      );
    }
  }
}
