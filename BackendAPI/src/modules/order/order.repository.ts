import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDto, PartialProductDto } from './dto/createOrder.dto';
import { MembershipService } from '../membership/membership.service';
import { CreateOrderDetailDto } from '../order-details/dto/createOrderDetail.dto';

export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UsersService,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly membershipService: MembershipService,
  ) {}

  async find() {
    return await this.orderRepository.find({ relations: { userId: true } });
  }

  async getOrder(orderId: string) {
    const orderFound = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { orderDetails: true },
    });
    if (!orderFound)
      throw new NotFoundException(
        'La orden no se encuentra en la base de datos',
      );

    const { orderDetails, ...orderQuery } = orderFound;

    const foundOrderDetails = await this.orderDetailsService.findOneBy(
      orderQuery,
      ['order', 'membershipId'],
    );

    return {
      ...orderFound,
      orderDetails: foundOrderDetails,
    };
  }

  async addOrder(orderDto: CreateOrderDto) {
    const { userId, product } = orderDto;
    const foundUser = await this.userService.getUserById(userId);
    if (!foundUser) {
      throw new NotFoundException('El usuario no ha sido encontrado');
    }

    const order = new Order();
    order.userId = foundUser;

    const newOrder = await this.orderRepository.save(order);
    const total = await this.calculateTotal(product);

    const orderDetail = new CreateOrderDetailDto();
    orderDetail.price = total;
    orderDetail.product = product;
    orderDetail.order = newOrder;

    return await this.orderDetailsService.createOrderDetail(orderDetail);
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    await this.orderRepository.delete(order);
    return {
      mensaje: `La orden del usuario ${order.userId.id} ha sido eliminada`,
    };
  }

  async calculateTotal(products: Array<PartialProductDto>) {
    let total = 0;
    for (const product of products) {
      if (product.id) {
        throw new NotFoundException('Falta el id del producto');
      }

      const productPrice = await this.membershipService.purchaseMembership(
        product.id,
      );
      total += productPrice;
    }

    return total;
  }
}
