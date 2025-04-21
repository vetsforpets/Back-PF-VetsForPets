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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDetailDto } from './dto/createOrderDetail.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Order Details')
@UseGuards(RolesGuard)
@Admin()
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalles de orden por ID de orden' })
  @ApiOkResponse({ description: 'Detalles de orden encontrados con éxito' })
  @ApiNotFoundResponse({ description: 'Detalles de orden no encontrados' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiUnauthorizedResponse({description: 'No autorizado'})
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
  @ApiOperation({ summary: 'Crear detalles de orden' })
  @ApiCreatedResponse({ description: 'Detalles de orden creados con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBody({ type: CreateOrderDetailDto })
  @ApiUnauthorizedResponse({description: 'No autorizado'})
  createOrderDetail(@Body() orderDetail: CreateOrderDetailDto) {
    try {
      return this.orderDetailsService.createOrderDetail(orderDetail);
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