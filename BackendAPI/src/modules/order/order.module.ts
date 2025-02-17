import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderDetails } from '../order-details/entity/order-details.entity';
import { Users } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';
import { OrderDetailsModule } from '../order-details/order-details.module';
import { Membership } from '../membership/entity/membership.entity';
import { MembershipModule } from '../membership/membership.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetails, Users, Membership,]),
    UsersModule,
    OrderDetailsModule,
    MembershipModule,
    PaymentModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
