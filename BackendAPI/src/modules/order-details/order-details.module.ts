import { Module } from '@nestjs/common';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order-details.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { Order } from '../order/entity/order.entity';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Order, Users])],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, OrderDetailsRepository],
  exports: [OrderDetailsService, OrderDetailsRepository],
})
export class OrderDetailsModule {}
