import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository]
})
export class OrderModule {}
