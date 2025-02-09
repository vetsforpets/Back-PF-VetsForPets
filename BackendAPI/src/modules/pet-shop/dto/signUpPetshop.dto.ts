import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PetShopDto {
  /**
   * El nombre de la veterinaria/petshop debe tener al menos 4 caracteres.
   * @ejemplo Vets
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  /**
   * El correo electrónico de la veterinaria/petshop debe ser único y válido.
   * @ejemplo vets@gmail.com
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  /**
   * La contraseña de la veterinaria debe tener un mínimo de 8 caracteres y un máximo de 15, con al menos un carácter especial, una letra minúscula y una mayúscula.
   * @ejemplo Pa$$word1
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
   * @ejemplo Pa$$word1
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
   * @ejemplo +584244257832
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
   * La localizacion donde se encuentra la veterinaria/petshop.
   */
  @IsString()
  @IsNotEmpty()
  location: string;
}
