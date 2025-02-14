import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Order } from "../../../modules/order/entity/order.entity"
import { Type } from "class-transformer"

export class CreateOrderDetailDto {

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsArray()
    @ArrayMinSize(1)
    membership: Array<Object>
    
    @IsString()
    paymentMethod: string

    @Type(()=> Order)
    order: Order

}