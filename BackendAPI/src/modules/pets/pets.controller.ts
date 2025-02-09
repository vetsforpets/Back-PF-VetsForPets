import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
    async getPetById(@Param('id') id: string): Promise<Pets> {
        return this.petsService.getPetById(id)
    }

    @Post('/register')
    async createNewPet(@Body() newPet: CreatePetDto){
    }
}
