import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMinSize, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { Membership } from "src/modules/membership/entity/membership.entity"

export class CreateOrderDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'El ID del usuario debe ser tipo uuid y una llave foranea',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    userId: string
    
    @ArrayMinSize(1)
    @Type(()=> PartialProductDto)
    product: PartialProductDto[]
}

export class PartialProductDto extends PartialType(Membership){
    products: PartialProductDto[]
}