import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleCallbackDto {
  @ApiProperty({ description: 'Authorization code from Google OAuth.' })
  @IsString()
  @IsNotEmpty()
  code: string;
}