import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pets } from './entity/pets.entity';
import { CreatePetDto } from './dto/create.pet.dto';

@Controller('pets')
export class PetsController {
    constructor(
        private readonly petsService: PetsService
    ){}

    @Get()
    async getAllPets(): Promise<Pets[]> {
        return this.petsService.getAllPets()
    }

    @Get(':id')
    async getPetById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Pets> {
        return this.petsService.getPetById(id)
    }

    @Post('/register')
    async createNewPet(@Body() newPet: CreatePetDto): Promise<Pets> {
        return this.petsService.createNewPet(newPet)
    }

    @Put(':id')
    async updatePet(@Param('id', new ParseUUIDPipe()) id: string, @Body() updatedPet: Partial<CreatePetDto>): Promise<Partial<Pets>> {
        return this.petsService.updatePet(id, updatedPet);
    }

    @Delete(':id')
    async deletePet(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.petsService.deletePet(id);
    }
}
