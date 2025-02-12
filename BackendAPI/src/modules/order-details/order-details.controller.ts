import { Controller } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';

@Controller('order-details')
export class OrderDetailsController {
    constructor(private readonly orderDetailsService: OrderDetailsService){}
}
