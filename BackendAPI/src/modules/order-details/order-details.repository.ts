import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order-details.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/createOrderDetail.dto';

export class OrderDetailsRepository {
  constructor(
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async findOneBy(order: Object, relations: string[] = []) {
    return await this.orderDetailsRepository.find({
      where: order,
      relations: relations,
    });
  }

  async createOrderDetail(orderDetail: CreateOrderDetailDto) {
    return await this.orderDetailsRepository.save(orderDetail);
  }

  async findDetaildOrderById(id: string) {
    return await this.orderDetailsRepository.findOne({
      where: { id },
    });
  }
}
