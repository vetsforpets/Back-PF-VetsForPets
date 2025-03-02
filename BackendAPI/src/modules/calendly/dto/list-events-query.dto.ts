import { IsOptional, IsInt, Min, Max, IsEmail, IsString, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListEventsQueryDto {
  @ApiProperty({
    description: 'El número de eventos a retornar (máximo 100).',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  count?: number;

  @ApiProperty({
    description: 'Filtrar eventos por URI del grupo.',
    example: 'https://api.calendly.com/groups/12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({
    description: 'Filtrar eventos por correo electrónico del invitado.',
    example: 'usuario.prueba@ejemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  invitee_email?: string;

  @ApiProperty({
    description: 'Filtrar eventos con horas de inicio anteriores a esta hora (formato ISO 8601).',
    example: '2023-11-15T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  max_start_time?: string;

  @ApiProperty({
    description: 'Filtrar eventos con horas de inicio posteriores a esta hora (formato ISO 8601).',
    example: '2023-11-10T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  min_start_time?: string;

  @ApiProperty({
    description: 'Filtrar eventos por URI de la organización.',
    example: 'https://api.calendly.com/organizations/67890',
    required: false,
  })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({
    description: 'Token para paginación (página siguiente o anterior).',
    example: 'token_pagina_siguiente_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  page_token?: string;

  @ApiProperty({
    description: 'Ordenar resultados por start_time:asc o start_time:desc.',
    example: 'start_time:asc',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: 'Filtrar eventos por estado (activo o cancelado).',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Filtrar eventos por URI del usuario.',
    example: 'https://api.calendly.com/users/54321',
    required: false,
  })
  @IsOptional()
  @IsString()
  user?: string;
  @ApiProperty({
    description: 'Filtrar eventos por preguntas específicas.',
    example: ['¿Cuál es tu nombre?', '¿Cómo te enteraste del evento?'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questions?: string[];
}