import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, IsUrl, Length, Min } from "class-validator";

export class CreatePetDto {

    @ApiProperty({
        description: 'El ID del usuario dueño de la mascota.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' 
    })
    @IsUUID()
    userId: string; D

    @ApiProperty({
        example: 'Sam',
        description: 'El nombre de la mascota debe tener al menos 3 caracteres.',
        minLength: 3
    })
    @IsString()
    @Length(3) 
    name: string;

    @ApiProperty({
        example: 3,
        description: 'La edad de la mascota en años.'
    })
    @IsNumber()
    @Min(0) 
    age: number;

    @ApiProperty({
        example: 'Perro',
        description: 'El tipo de mascota (e.g., Perro, Gato, Pájaro).'
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: '2023-10-26',
        description: 'La fecha de nacimiento de la mascota (YYYY-MM-DD).'
    })
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({
        example: 'URL de la imagen de perfil',
        description: 'La URL de la imagen de perfil de la mascota. Opcional.'
    })
    @IsOptional()
    @IsUrl()
    profileImg: string;
}