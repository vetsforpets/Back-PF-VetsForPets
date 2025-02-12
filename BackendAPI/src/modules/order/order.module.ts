import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderDetails } from '../order-details/entity/order-details.entity';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetails, Users])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository]
})
export class OrderModule {}
