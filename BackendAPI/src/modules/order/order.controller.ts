import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Order')
// @UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  @Admin()
  @Roles(Role.USER)
  findAll() {
    try {
      return this.orderService.find();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error inesperado en el controlador: ', error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error inesperado en la peticion, por favor revise e intente nuevamente',
      );
    }
  }

  @Post()
  // @Roles(Role.USER, Role.PETSHOP)
  addOrder(@Body() orderDto: CreateOrderDto) {
    try {
      return this.orderService.addOrder(orderDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al enviar la peticion, por favor revise y diligencie todos los campos correctamente',
      );
    }
  }

  @Delete(':id')
  @Admin()
  deleteOrder(@Param('id', ParseUUIDPipe) orderId: string) {
    try {
      return this.orderService.deleteOrder(orderId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al enviar la peticion, por favor ingrese un ID valido',
      );
    }
  }

  @Get(':id')
  @Admin()
  getOneOrderBy(@Param('id', ParseUUIDPipe) orderId: string) {
    try {
      return this.orderService.getOrderById(orderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error inesperado en la peticion, por favor revise e intente nuevamente',
      );
    }
  }
}
