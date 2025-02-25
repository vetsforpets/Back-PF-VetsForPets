import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto, OrderDto } from './dto/createOrder.dto';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly emailService: EmailService,
    private readonly userService: UsersService
  ) { }

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


  async addOrder(orderDto: CreateOrderDto) {
    try {
      const newOrder = this.orderRepository.addOrder(orderDto);
      if (newOrder && orderDto.userId) {
        try {
          const user = await this.userService.getUserById(orderDto.userId);
          if (user) {
            const emailDto: sendEmailDto = {
              recipients: user.email,
              subject: '¡Nueva Orden Registrada en VetsForPets!',
              html: `
                <p>¡Hola ${user.name}!</p>
                <p>Tu orden ha sido registrada exitosamente en VetsForPets.</p>
                <p>¡Gracias por confiar en nosotros!</p>
                <p>Atentamente,<br>El equipo de VetsForPets</p>
              `,
            };
            await this.emailService.sendEmail(emailDto);
          }
        } catch (emailError) {
          console.error('Error al enviar email de creacion de orden de compra: ', emailError)
        }
      }
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

  async deleteOrder(orderId: string) {
    try {
      const orderToDelete = await this.orderRepository.getOrder(orderId)
      console.log('orderToDelete:', orderToDelete);
      if (!orderToDelete) {
        throw new NotFoundException('Orden no encontrada')
      }      

      if (orderToDelete.userId) {
        try {
          const user = await this.userService.getUserById(orderToDelete.userId.id);
          console.log('user:', user);          
          if (user) {
            const emailDto: sendEmailDto = {
              recipients: user.email, 
              subject: 'Orden Eliminada en VetsForPets',
              html: `
                <p>¡Hola ${user.name}!</p>
                <p>Tu orden ha sido eliminada de VetsForPets.</p>
                <p>Atentamente,<br>El equipo de VetsForPets</p>
              `,
            };
            await this.emailService.sendEmail(emailDto);
          } else {
            console.log('User not found for order ID:', orderId); 
          }
        } catch (emailError) {
          console.error('Error al enviar email de eliminacion de orden de compra: ', emailError)
        }
      }
      await this.orderRepository.deleteOrder(orderId);
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

  updateOrder(orderId: string, orderDto: OrderDto) {
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

  findOrderBySessionId(sessionId: string) {
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
