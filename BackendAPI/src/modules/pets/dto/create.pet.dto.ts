import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUrl, Length, Min } from "class-validator";
import { Appointment } from "src/modules/appointment/entity/appointment.entity";
import { Sex } from "src/modules/common/enums/petSex.enum";



export class CreatePetDto {

    @ApiProperty({
        example: 'Polo',
        description: 'El nombre de la mascota debe tener al menos 3 caracteres.',
        minLength: 3
    })
    @IsString()
    @Length(3) 
    name: string

    @ApiProperty({
        example: 3,
        description: 'La edad de la mascota en años.'
    })

    @ApiProperty({
        example: 'Perro',
        description: 'El tipo de mascota (e.g., Perro, Gato, Pájaro).'
    })
    @IsString()
    animalType: string

    @ApiProperty({
        example: '2023-10-26',
        description: 'La fecha de nacimiento de la mascota (YYYY-MM-DD).'
    })
    @IsDateString()
    birthdate: string

    @ApiProperty({
        example: 'Pastor Alemán',
        description: 'La raza de la mascota. Opcional.'
    })
    @IsOptional()
    @IsString()
    breed?: string

    @ApiProperty({
        example: 'Male',
        description: 'El sexo de la mascota (Male, Female, Unknown).'
    })
    @IsEnum(Sex)
    sex: Sex    

    @ApiProperty({
        example: true,
        description: 'Indica si la mascota está esterilizada.'
    })
    @IsOptional()
    @IsBoolean()
    isSterilized?: boolean

    @ApiProperty({
        example: 'Es muy juguetón y le gusta correr.',
        description: 'Notas adicionales sobre la mascota. Opcional.'
    })
    @IsOptional()
    @IsString()
    notes?: string

    @ApiProperty({
        example: 'https://example.com/profile.jpg',
        description: 'La URL de la imagen de perfil de la mascota. Opcional.'
    })
    @IsOptional()
    @IsUrl()
    profileImg?: string

    @IsOptional()
    @IsArray()
    appointments?: Appointment[] 
}