import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDetailDto } from './dto/createOrderDetail.dto';

@ApiTags('Order-details')
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get(':id')
  findOneOrderDetailBy(orderId: string) {
    try {
      return this.orderDetailsService.findDetaildOrderById(orderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error con la peticion, por favor intente mas tarde',
      );
    }
  }

  @Post()
  createOrderDetail(orderDetail: CreateOrderDetailDto) {
    try {
        return this.orderDetailsService.createOrderDetail(orderDetail)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error con la peticion, por favor intente mas tarde',
      );
    }
  }
}
