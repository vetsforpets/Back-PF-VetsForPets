import { Module } from '@nestjs/common';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order-details.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { Order } from '../order/entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Order])],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, OrderDetailsRepository],
  exports: [OrderDetailsService, OrderDetailsRepository],
})
export class OrderDetailsModule {}
