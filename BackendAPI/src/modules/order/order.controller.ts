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
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Orders')
@UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Admin()
  @Roles(Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtiene todas las ordenes de la base de datos' })
  @ApiOkResponse({ description: 'Lista de todas las ordenes' })
  @ApiNotFoundResponse({ description: 'No se encontraron ordenes en la base de datos' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una nueva orden con la informacion del usuario y membresia',
  })
  @ApiCreatedResponse({ description: 'Orden creada con exito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBody({ type: CreateOrderDto })
  @Roles(Role.USER, Role.PETSHOP)
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
  @ApiBearerAuth()
  @Admin()
  @ApiOperation({ summary: 'Elimina una orden por ID' })
  @ApiOkResponse({ description: 'Orden eliminada con éxito' })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
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
  @ApiBearerAuth()
  @Admin()
  @ApiOperation({ summary: 'Obtiene una orden por ID' })
  @ApiOkResponse({ description: 'Orden encontrada con éxito' })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
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