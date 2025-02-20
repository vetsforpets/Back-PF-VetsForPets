import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto, OrderDto } from './dto/createOrder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  find() {
    try {
      const orders = this.orderRepository.find();
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


  addOrder(orderDto: CreateOrderDto) {
    try {
      const newOrder = this.orderRepository.addOrder(orderDto);
      return newOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un problema al crear la orden en la base de datos',
      );
    }
  }

  deleteOrder(orderId: string) {
    try {
      return this.orderRepository.deleteOrder(orderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'No se pudo borrar la orden en la base de datos',
      );
    }
  }

  getOrderById(orderId: string) {
    try {
      const order = this.orderRepository.getOrder(orderId);
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

  updateOrder(orderId: string, orderDto: OrderDto){
    try {
      const updatedOrder = this.orderRepository.updateOrder(orderId, orderDto)
      return updatedOrder
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error al realizar la operacion desde la base de datos',
      );
    }
  }

  findOrderBySessionId(sessionId: string){
    try {
      return this.orderRepository.findOrderBySessionId(sessionId)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error al buscar la session en la base de datos',
      );
    }
  }

}
