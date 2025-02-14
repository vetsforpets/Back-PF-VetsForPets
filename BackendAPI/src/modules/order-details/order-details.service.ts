import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderDetailsRepository } from './order-details.repository';
import { CreateOrderDetailDto } from './dto/createOrderDetail.dto';

@Injectable()
export class OrderDetailsService {
  constructor(
    private readonly orderDetailsRepository: OrderDetailsRepository,
  ) {}

  findOneBy(order: Object, relations: string[] = []) {
    try {
      const orderFiltered = this.orderDetailsRepository.findOneBy(
        order,
        relations,
      );
      return orderFiltered;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'No se encontro la orden en la base de datos',
      );
    }
  }

  createOrderDetail(orderDetail: CreateOrderDetailDto) {
    try {
      return this.orderDetailsRepository.createOrderDetail(orderDetail);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Fallo la operacion de crear el detalle de la orden desde la DB',
      );
    }
  }

  findDetaildOrderById(id: string) {
    try {
      return this.orderDetailsRepository.findDetaildOrderById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('');
    }
  }
}
