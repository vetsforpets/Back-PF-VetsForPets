import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class MembershipDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @ApiProperty({
        "description": "Cuánto cuesta la membresía.",
        "example": 150.00
    })
    price: number

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    benefits: string[]

    @IsString()
    @IsOptional()
    startDate?: Date

    @IsString()
    @IsOptional()
    endDate?: Date

    @IsEmpty()
    @ApiProperty({
        "description": "Es definido por default, no se puede recibir en la petición.",
    })
    status: boolean
} 