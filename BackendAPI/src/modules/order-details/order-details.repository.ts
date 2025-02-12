import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order-details.entity';
import { Repository } from 'typeorm';

export class OrderDetailsRepository {
  constructor(
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}
}
