import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { MembershipDto } from '../membership/dto/membership.dto';
import { Order } from '../order/entity/order.entity';
import { OrderService } from '../order/order.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_ACCESS_KEY, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCheckoutSession(order: Order, membership: MembershipDto[]) {
    console.log('Creating checkout session for order ID:', order.id);

    try {
      const lineItems = membership.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: Array.isArray(item.benefits)
              ? item.benefits.join(',')
              : item.benefits,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url:
          'https://front-pf-vets-for-pets.vercel.app/success-transaction',
        cancel_url:
          'https://front-pf-vets-for-pets.vercel.app/canceled-transaction',
        metadata: {
          orderId: order.id,
        },
      });
      await this.orderService.updateOrder(order.id, { sessionId: session.id });

      return session;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw error;
    }
  }

  constructStripeEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      return JSON.parse(payload.toString()) as Stripe.Event;
      // return this.stripe.webhooks.constructEvent(
      //   payload,
      //   signature,
      //   process.env.STRIPE_WEBHOOK_SECRET,
      // );
    } catch (error) {
      throw new BadRequestException(`Error con el webhook: ${error.message}`);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('Processing webhook for session ID:', session.id);
    let orderId = session.metadata.orderId;
    console.log('Metadata orderId:', orderId);

    if (!orderId) {
      const order = await this.orderService.findOrderBySessionId(session.id);
      console.log('Order found by sessionId:', order);

      if (!order) {
        throw new BadRequestException(
          'No se ha encontrado la orden asociada a la session id',
        );
      }
      orderId = order.id;
    }
    console.log('Using orderId:', orderId);

    const order = await this.orderService.getOrderById(orderId);
    console.log(
      '🚀 ~ PaymentService ~ handleCheckoutSessionCompleted ~ order:',
      order,
    );

    if (order) {
      const userId =
        typeof order.userId === 'object' ? order.userId.id : order.userId;
      console.log('Updating user with ID:', userId);

      const updateResult = await this.usersService.updateUser(userId, {
        isPremium: true,
      });
      console.log('Update result:', updateResult);

      return updateResult;
    } else {
      throw new NotFoundException('No se ha encontrado la orden');
    }
  }
}
