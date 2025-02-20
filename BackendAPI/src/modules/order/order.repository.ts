import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CreateOrderDto,
  MembershipProductDto,
  OrderDto,
} from './dto/createOrder.dto';
import { MembershipService } from '../membership/membership.service';
import { CreateOrderDetailDto } from '../order-details/dto/createOrderDetail.dto';
import { PaymentService } from '../payment/payment.service';

export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UsersService,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly membershipService: MembershipService,
    private readonly paymentService: PaymentService,
  ) { }

  async find() {
    return await this.orderRepository.find({ relations: { userId: true } });
  }

  async getOrder(orderId: string) {
    const orderFound = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['userId', 'orderDetails'],
    });
    if (!orderFound)
      throw new NotFoundException(
        'La orden no se encuentra en la base de datos',
      );

    const { orderDetails, ...orderQuery } = orderFound;

    const foundOrderDetails = await this.orderDetailsService.findOneBy(
      orderQuery,
      ['order', 'membership'],
    );

    return {
      ...orderFound,
      orderDetails: foundOrderDetails,
    };
  }

  async addOrder(orderDto: CreateOrderDto) {
    const { userId, membership, paymentMethod } = orderDto;
    const foundUser = await this.userService.getUserById(userId);
    if (!foundUser) {
      throw new NotFoundException('El usuario no ha sido encontrado');
    } else if (foundUser.isPremium === true) {
      throw new BadRequestException('El usuario ya tiene una membresia activa');
    }

    const membershipEntities = await Promise.all(
      membership.map((item) =>
        this.membershipService.findOneMembership(item.id),
      ),
    );


    const order = new Order();
    order.userId = foundUser;

    const newOrder = await this.orderRepository.save(order);
    const total = await this.calculateTotal(membershipEntities);

    const orderDetail = new CreateOrderDetailDto();
    orderDetail.order = newOrder;
    orderDetail.price = total;
    orderDetail.membership = membershipEntities;
    orderDetail.paymentMethod = paymentMethod;

    const createdOrderDetail =
      await this.orderDetailsService.createOrderDetail(orderDetail);
    const checkoutSession = await this.paymentService.createCheckoutSession(
      newOrder,
      membershipEntities,
    );

    return {
      order: newOrder,
      orderDetails: createdOrderDetail,
      checkoutSessionUrl: checkoutSession.url,
    };
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

  async calculateTotal(memberships: MembershipProductDto[]) {
    let total = 0;

    for (const membership of memberships) {
      if (!membership) {
        throw new NotFoundException('Missing membership id');
      }
      const productPrice = await this.membershipService.purchaseMembership(
        membership.id,
      );
      total += productPrice;
    }
    return total;
  }

  async updateOrder(orderId: string, orderDto: OrderDto) {
    return await this.orderRepository.update(orderId, orderDto);
  }

  async findOrderBySessionId(sessionId: string): Promise<Order | undefined> {
    return await this.orderRepository.findOne({
      where: { sessionId },
    });
  }
}
