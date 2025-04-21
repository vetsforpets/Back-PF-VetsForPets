import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Pets } from 'src/modules/pets/entity/pets.entity';

export class UpdatePetShopDto {
  @ApiProperty({
    description: 'Nombre de la veterinaria',
    example: 'Vets',
    minLength: 4,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name?: string;

  @ApiProperty({
    description: 'Nombre del veterinario',
    example: 'Jaime',
    minLength: 4,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  veterinarian?: string;

  @ApiProperty({
    description: 'Correo electrónico de la veterinaria',
    example: 'vets@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+584244257832',
    minLength: 10,
    maxLength: 13,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber?: string;

  @ApiProperty({
    description: 'URL de la imagen de perfil',
    example: 'http://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imgProfile?: string;

  @ApiProperty({
    description: '¿Está abierto 24 horas?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is24Hours?: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({
    description: 'Número de licencia del veterinario',
    example: 1234567890,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  licenseNumber?: number;

  @ApiProperty({
    description: 'Año de fundación (YYYY)',
    example: '2005',
    pattern: '^\\d{4}$',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'El año de fundación debe tener 4 dígitos (YYYY).',
  })
  foundation?: string;

  @ApiProperty({
    description: 'Ubicación de la veterinaria',
    example: [{ latitude: 40.73061, longitude: -73.935242 }],
  })
  @IsArray()
  location?: [{ latitude: number; longitude: number }];

  @ApiProperty({
    description: 'Notificaciones emergentes urgentes',
    default: [],
  })
  @IsArray()
  emergencies?: { userId: string; pet: Partial<Pets>; chatId: string }[];

  @ApiProperty({
    description: 'El horario de atención de la veterinaria/petshop.',
    example: {
      monday: { opening: '08:00', closure: '18:00' },
      tuesday: { opening: '08:00', closure: '18:00' },
      wednesday: { opening: '08:00', closure: '18:00' },
      thursday: { opening: '08:00', closure: '18:00' },
      friday: { opening: '08:00', closure: '18:00' },
      saturday: { opening: '10:00', closure: '14:00' },
      sunday: { opening: 'Closed', closure: 'Closed' },
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  businessHours?: {
    [day: string]: {
      opening: string;
      closure: string;
    };
  };
}
