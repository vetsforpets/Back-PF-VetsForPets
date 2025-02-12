import { Injectable } from '@nestjs/common';
import { OrderDetailsRepository } from './order-details.repository';

@Injectable()
export class OrderDetailsService {
    constructor(private readonly orderDetailsRepository: OrderDetailsRepository ){}
}
