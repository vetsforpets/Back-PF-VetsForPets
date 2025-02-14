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
  /**
   * El nombre del veterinario debera por lo menos tener 3 caracteres.
   * @example Jaime
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  /**
   * El nombre de la veterinaria/petshop debe tener al menos 4 caracteres.
   * @example Vets
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  veterinarian: string;

  /**
   * El correo electrónico de la veterinaria/petshop debe ser único y válido.
   * @example vets@gmail.com
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  /**
   * La contraseña de la veterinaria debe tener un mínimo de 8 caracteres y un máximo de 15, con al menos un carácter especial, una letra minúscula y una mayúscula.
   * @example Pa$$word1
   */
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

  /**
   * La confirmación de contraseña debe coincidir con la contraseña.
   * @example Pa$$word1
   */
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

  /**
   * El número de teléfono debe tener al menos 10 caracteres.
   * @example +584244257832
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;

  /**
   * Marcar si tiene disponible el servicio de urgencias 24/7.
   */

  @IsNotEmpty()
  @IsBoolean()
  is24Hours: boolean;

  /**
   * El numero de licencia del veterinario.
   * @example 1234564789
   */
  @IsNumber()
  licenseNumber: number;

  /**
   * El horario de atencion de la veterinaria/petshop.
   * @example        
   * "monday": {"opening": "08:00","closure": "18:00"},
   * "tuesday": {"opening": "08:00","closure": "18:00"},
   * "wednesday": {"opening": "08:00","closure": "18:00"},
   * "thursday": {"opening": "08:00","closure": "18:00"},
   * "friday": {"opening": "08:00","closure": "18:00"},
   * "saturday": {"opening": "10:00","closure": "14:00"},
   * "sunday": {"opening": "Closed","closure": "Closed"}
   */
  @IsNotEmpty()
  @IsObject()
  businessHours: {
    [day: string]: {
      opening: string;
      closure: string;
    };
  };
}
