import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PetsRepository } from './pets.repository';
import { CreatePetDto } from './dto/create.pet.dto';
import { Pets } from './entity/pets.entity';

@Injectable()
export class PetsService {
  constructor(private readonly petsRepository: PetsRepository) {}

  async getAllPets(): Promise<Pets[]> {
    return await this.petsRepository.getPets();
  }

  async getPetById(id: string): Promise<Pets> {
    const pet = await this.petsRepository.getPetById(id);
    if (!pet) {
      throw new NotFoundException('Mascota no encontrada');
    }
    return pet;
  }

  async createNewPet(
    pet: CreatePetDto,
    userId: string,
  ): Promise<Partial<Pets>> {
    try {
      return await this.petsRepository.createNewPet(pet, userId);
    } catch (error) {
      console.error('Error al crear la mascota:', error);
      throw new Error('Error al crear la mascota en la base de datos.');
    }
  }

  async updatePet(
    petId: string,
    updatePet: Partial<CreatePetDto>,
  ): Promise<Partial<Pets>> {
    try {
      const updatedPet = await this.petsRepository.updatePet(petId, updatePet);
      return updatedPet;
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update pet.');
    }
  }

  async deletePet(petId: string): Promise<void> {
    try {
      await this.petsRepository.deletePet(petId);
    } catch (error) {
      console.error('Error deleting pet:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete pet');
    }
  }
}
