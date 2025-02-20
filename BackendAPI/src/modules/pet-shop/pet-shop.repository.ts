import { InjectRepository } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';


export class PetShopRepository {
  constructor(
    @InjectRepository(PetShop)
    private readonly petshopRepository: Repository<PetShop>,
  ) { }

  async getAllPetshops(): Promise<PetShop[]> {
    try {
      return await this.petshopRepository.find({
        select: {
          id: true,
          name: true,
          veterinarian: true,
          email: true,
          phoneNumber: true,
          imgProfile: true,
          is24Hours: true,
          location: true,
          licenseNumber: true,
          foundation: true,
          role: true
        },
      });
    } catch (error) {
      console.error('Error en la carga de veterinarias', error);
      throw new InternalServerErrorException('Se generó un error al obtener las veterinarias en la base de datos.');
    }
  }

  async getPetShopById(id: string): Promise<PetShop> {
    const petShopFound = await this.petshopRepository.findOne({ where: { id } });
    if (!petShopFound) {
      throw new NotFoundException('Veterinaria no encontrada');
    }
    return petShopFound
  }

  async getPetShopByEmail(email: string) {
    try {
      const petshopFiltered = await this.petshopRepository.findOne({ where: { email } })
      return petshopFiltered
    } catch (error) {
      console.error('Error al conseguir la veterinaria:', error)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Se generó un error al obtener la veterinaria en la base de datos.')
    }
  }

  async savePetshop(petshopData: Partial<PetShop>): Promise<PetShop> {
    try {
      const newPetshop = this.petshopRepository.create(petshopData);
      return await this.petshopRepository.save(newPetshop)
    } catch (error) {
      console.error('Error en la creacion de la veterinaria:', error)
      throw new InternalServerErrorException('Se genero un error al crear la veterinaria en la base de datos.')
    }
  }

  async updatePetshop(id: string, petshopData: Partial<PetShop>): Promise<PetShop | undefined> {
    try {
      if (petshopData.email) {
        const existingPetShop = await this.getPetShopByEmail(petshopData.email);
        if (existingPetShop && existingPetShop.id !== id) {
          throw new ConflictException('El correo electrónico ya está en uso.');
        }
      }

      const result = await this.petshopRepository.update(id, petshopData);
      if (result.affected === 0) {
        return undefined;
      }
      return await this.getPetShopById(id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error al actualizar la veterinaria:', error);
      throw new InternalServerErrorException(`Se generó un error al actualizar la veterinaria en la base de datos: ${error.message}`);
    }
  }

  async deletePetshop(id: string): Promise<void> {
    try {
      const result = await this.petshopRepository.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('La veterinaria no fue encontrada.')
      }
    } catch (error) {
      console.error('Error en eliminar una veterinaria:', error)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Se generó un error al eliminar la veterinaria en la base de datos.')
    }
  }

}
