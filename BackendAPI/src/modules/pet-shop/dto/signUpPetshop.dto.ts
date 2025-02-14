import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpPetShopDto {
  @ApiProperty({ description: 'Nombre de la veterinaria', example: 'Vets', minLength: 4, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @ApiProperty({ description: 'Nombre del veterinario', example: 'Jaime', minLength: 4, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  veterinarian: string;

  @ApiProperty({ description: 'Correo electrónico de la veterinaria', example: 'vets@gmail.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contraseña de la veterinaria', example: 'Pa$$word1', minLength: 8, maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
    },
  )
  password: string;

  @ApiProperty({ description: 'Confirmación de contraseña', example: 'Pa$$word1', minLength: 8, maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'La confirmación de contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
    },
  )
  confirmPassword: string;

  @ApiProperty({ description: 'Número de teléfono', example: '+584244257832', minLength: 10, maxLength: 13 })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber: string;

  @ApiProperty({ description: 'URL de la imagen de perfil', example: 'http://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imgProfile?: string;


  @ApiProperty({ description: '¿Está abierto 24 horas?', example: true })
  @IsNotEmpty()
  @IsBoolean()
  is24Hours: boolean;


  @ApiProperty({ description: 'Ubicación de la veterinaria', example: 'Caracas, Venezuela' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Número de licencia del veterinario', example: 1234567890 })
  /**
   * El numero de licencia del veterinario.
   * @example 1234564789
   */
  @IsNumber()
  licenseNumber: number;
  
  @ApiProperty({ description: 'Año de fundación (YYYY)', example: '2005', pattern: '^\\d{4}$' }) // ApiProperty for Swagger
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'El año de fundación debe tener 4 dígitos (YYYY).' }) // Validation for YYYY format
  foundation: string;

  // /**
  //  * El horario de atencion de la veterinaria/petshop.
  //  * @example        
  //  * "monday": {"opening": "08:00","closure": "18:00"},
  //  * "tuesday": {"opening": "08:00","closure": "18:00"},
  //  * "wednesday": {"opening": "08:00","closure": "18:00"},
  //  * "thursday": {"opening": "08:00","closure": "18:00"},
  //  * "friday": {"opening": "08:00","closure": "18:00"},
  //  * "saturday": {"opening": "10:00","closure": "14:00"},
  //  * "sunday": {"opening": "Closed","closure": "Closed"}
  //  */
  // @IsNotEmpty()
  // @IsObject()
  // businessHours: {
  //   [day: string]: {
  //     opening: string;
  //     closure: string;
  //   };
  // };
}
