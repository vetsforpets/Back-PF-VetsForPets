import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entity/order.entity";
import { Repository } from "typeorm";

export class OrderRepository {
    constructor(@InjectRepository(Order) orderRepository: Repository<Order> ){}
}