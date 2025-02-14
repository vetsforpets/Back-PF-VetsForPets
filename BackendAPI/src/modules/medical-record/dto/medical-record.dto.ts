import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export class MedicalRecordDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @ApiProperty({
        "description": "Coloca la raza de la mascota",
        "examples": ["Labrador Retriever", "Gato Siames"]
    })
    breed: string

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        "description": "Muestra la fecha en que fue emitido/agregado el registro médico",
        "example": "2025/02/12"
    })
    date: Date

    @IsString()
    @IsOptional()
    @IsArray()
    @ApiProperty({
        "description": "Archivo cargado del resultado del examen médico"
    })
    examResults?: string[]

    @IsString()
    @IsOptional()
    @IsArray()
    @ApiProperty({
        "description": "Imagen que se quiera adjuntar al registro médico",
        "examples": ["Radiografía", "Ecografía"]
    })
    image?: string[]
}
