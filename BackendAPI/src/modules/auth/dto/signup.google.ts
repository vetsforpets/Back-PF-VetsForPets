import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class GoogleUserDto {
  @ApiProperty({ description: 'The user\'s email address.', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s first name.', example: 'John' })
  @IsNotEmpty()
  @IsString()
  given_name: string;

  @ApiProperty({ description: 'The user\'s last name.', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  family_name: string;

  @ApiProperty({ description: 'The user\'s profile picture URL (optional).', example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsUrl()
  picture?: string;

  @ApiProperty({ description: 'The user\'s full name.', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The user\'s google id.', example: '123412341234' })
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty({ description: 'Is the email verified.', example: true })
  @IsNotEmpty()
  email_verified: boolean;

}