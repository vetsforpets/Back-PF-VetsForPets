import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PetsRepository } from './pets.repository';
import { CreatePetDto } from './dto/create.pet.dto';
import { Pets } from './entity/pets.entity';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly emailService: EmailService
  ) {}

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
      const newPet =  await this.petsRepository.createNewPet(pet, userId);
      if(newPet && newPet.user){
        try {
          const emailDto: sendEmailDto = {
            recipients: newPet.user.email, 
            subject: '¡Nueva mascota registrada en VetsForPets!', 
            html: `
              <p>¡Hola ${newPet.user.name}!</p>
              <p>Tu mascota ${newPet.name} ha sido registrada exitosamente.</p>
              <p>¡Gracias por confiar en VetsForPets!</p>
              <p>Atentamente,<br>El equipo de VetsForPets</p>
            `,};
          await this.emailService.sendEmail(emailDto)
        } catch (error) {
          console.error('Error al enviar email de creación de mascota:', error);
        }
      }
    return newPet 
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
      if(updatePet){
        try {
          const emailDto: sendEmailDto = {
            recipients: updatedPet.user.email, 
            subject: 'Mascota actualizada en VetsForPets', 
            html: `
              <p>¡Hola ${updatedPet.user.name}!</p>
              <p>La información de tu mascota ${updatedPet.name} ha sido actualizada.</p>
              <p>Atentamente,<br>El equipo de VetsForPets</p>
            `};
          await this.emailService.sendEmail(emailDto);
        } catch (error) {
          console.error('Error al enviar email de actualización de mascota:', error);
        }
      }
      return updatedPet;
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error en la actualizacion de la mascota.');
    }
  }

  async deletePet(petId: string): Promise<void> {
    try {
      const petToDelete = await this.petsRepository.getPetById(petId);  // Get the pet

      if (!petToDelete) {
        throw new NotFoundException('Mascota no encontrada'); // Handle if pet not found
      }

      await this.petsRepository.deletePet(petId);

      try {
        const emailDto: sendEmailDto = {
          recipients: petToDelete.user.email, 
          subject: 'Mascota eliminada de VetsForPets',
          html: `
            <p>¡Hola ${petToDelete.user.name}!</p>
            <p>Tu mascota ${petToDelete.name} ha sido eliminada de VetsForPets.</p>
            <p>Lamentamos mucho su partida.</p>
            <p>Atentamente,<br>El equipo de VetsForPets</p>
          `,
        };
        await this.emailService.sendEmail(emailDto);
      } catch (error) {
        console.error('Error al enviar email de eliminación de mascota:', error);
      }

    } catch (error) {
      console.error('Error eliminando la mascota:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Hubo un error al eliminar la mascota');
    }
  }
}
