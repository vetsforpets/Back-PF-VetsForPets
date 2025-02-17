import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({
    description: 'El nombre del usuario',
    example: 'Sam',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'El apellido del usuario',
    example: 'Suarez',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  lastName: string;

  @ApiProperty({
    description: 'La edad del usuario',
    example: 25,
  })
  @IsNotEmpty()
  @IsString()
  age: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'sam@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'Sam1234!',
    minLength: 8,
    maxLength: 15,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
  })
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

  @ApiProperty({
    description: 'La confirmación de contraseña',
    example: 'Sam1234!',
    minLength: 8,
    maxLength: 15,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
  })
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

  @ApiProperty({
    description: 'El número de teléfono del usuario',
    example: '+584244258847',
    minLength: 10,
    maxLength: 13,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber: string;

  @ApiProperty({
    description: 'La URL de la imagen de perfil del usuario (opcional)',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imgProfile?: string;
}
