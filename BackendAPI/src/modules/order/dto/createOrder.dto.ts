import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
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
  membership: MembershipProductDto[];

  @IsString()
  paymentMethod: string;
}

export class MembershipProductDto extends PartialType(Membership) {}
