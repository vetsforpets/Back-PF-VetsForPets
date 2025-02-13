import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async find() {
    try {
      const orders = await this.orderRepository.find();
      return orders;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error al traer las ordenes de la base de datos',
      );
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.orderRepository.getOrder(orderId);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error al traer la orden de la base de datos',
      );
    }
  }
}
