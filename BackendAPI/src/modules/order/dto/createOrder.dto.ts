import { ApiHideProperty, ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Membership } from 'src/modules/membership/entity/membership.entity';

export class CreateOrderDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'El ID del usuario debe ser tipo uuid y una llave foranea',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipProductDto)
  @ApiProperty({
    description: 'Informacion de la membresia o ID',
    example:   [{id: "db27293b-51cd-4b55-a9f5-924a25e728bb"}],
  })
  membership: MembershipProductDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'El metodo de pago usado para la compra de la membresia',
    example: 'Debit card',
  })
  paymentMethod: string;

  @IsOptional()
  @ApiHideProperty()
  sessionId?: string
}

export class OrderDto extends PickType(CreateOrderDto, ['sessionId']){ }

export class MembershipProductDto extends PartialType(Membership) {}
