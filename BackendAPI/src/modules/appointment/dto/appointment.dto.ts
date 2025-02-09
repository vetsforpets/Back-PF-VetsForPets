import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"

export class AppointmentDto {
    @IsNotEmpty()
    @ApiProperty({
        "description": 'La fecha seleccionada para el turno',
        "example": '2025/02/11'
    })
    date: Date

    @IsNotEmpty()
    @ApiProperty({
        "description": 'La hora seleccionada para el turno',
        "example": "11:30 a.m"
    })
    time: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @ApiProperty({
        "description": "El ID del usuario al que pertenece el turno",
        "example": "c9a1fb93-6a41-432d-8b9c-9e63c51fe0a2"
    })
    userId: string


    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty({
        "description": "Una descripción breve sobre el turno",
        "example": "Vacuna antirrábica"
    })
    description: string
}