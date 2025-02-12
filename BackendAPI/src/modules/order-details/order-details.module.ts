import { Module } from '@nestjs/common';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails])],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
