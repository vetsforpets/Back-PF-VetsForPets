import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDetailDto } from './dto/createOrderDetail.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Order-details')
@UseGuards(RolesGuard)
@Admin()

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) { }

  @Get(':id')
  @ApiBearerAuth()

  findOneOrderDetailBy(@Param('id', ParseUUIDPipe) orderId: string) {
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
  @ApiBearerAuth()
  createOrderDetail(@Body() orderDetail: CreateOrderDetailDto) {
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
