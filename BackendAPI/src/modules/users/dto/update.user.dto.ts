import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, IsNumber } from "class-validator"; // Removed password-related validators

export class UpdateUserDto {
    @ApiProperty({
        description: "El nombre del usuario",
        example: "Sam",
        minLength: 2,
        maxLength: 80,
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    name?: string

    @ApiProperty({
        description: "El apellido del usuario",
        example: "Suarez",
        minLength: 2,
        maxLength: 80,
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    lastName?: string

    @ApiProperty({
        description: "La edad del usuario",
        example: 25,
        required: false
    })
    @IsOptional()
    @IsNumber()
    age?: number

    @ApiProperty({
        description: "El correo electrónico del usuario",
        example: "sam@gmail.com",
        required: false
    })
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string

    @ApiProperty({
        description: "El número de teléfono del usuario",
        example: "+584244258847",
        minLength: 10,
        maxLength: 13,
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(13)
    phoneNumber?: string

    @ApiProperty({
        description: "La URL de la imagen de perfil del usuario (opcional)",
        example: "https://example.com/profile.jpg",
        required: false
    })
    @IsOptional()
    @IsString()
    imgProfile?: string
    
    @IsOptional()
    isPremium?: boolean
}