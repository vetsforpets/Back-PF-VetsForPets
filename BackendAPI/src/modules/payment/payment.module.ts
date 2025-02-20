import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderModule } from '../order/order.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Order } from '../order/entity/order.entity';


@Module({
  imports: [
    forwardRef(() => OrderModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Users, Order])
  ],
  controllers: [PaymentController],
  providers: [PaymentService,],
  exports: [PaymentService],
})
export class PaymentModule {}
