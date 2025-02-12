import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  /**
   * El nombre del usuario debe tener al menos 3 caracteres.
   * @example Sam
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  /**
   * El apellido del usuario debe tener al menos 6 caracteres.
   * @example Suarez
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(80)
  lastName: string;

  /**
   * La edad del usuario.
   * @example 25
   */
  @IsNotEmpty()
  @IsNumber()
  age: number;

  /**
   * El correo electrónico del usuario debe ser único y válido.
   * @example sam@gmail.com
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  /**
   * La contraseña del usuario debe tener un mínimo de 8 caracteres y un máximo de 15, con al menos un carácter especial, una letra minúscula y una mayúscula.
   * @example Sam1234!
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
   * @example Sam1234!
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
   * @example +584244258847
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  imgProfile?: string;
}
