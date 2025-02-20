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
      // return this.stripe.webhooks.constructEvent(
      //   payload,
      //   signature,
      //   process.env.STRIPE_WEBHOOK_SECRET,
      // );
      return JSON.parse(payload.toString()); // This bypasses verification
    } catch (error) {
      throw new BadRequestException(`Error con el webhook: ${error.message}`);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    let orderId = session.metadata.orderId;
    console.log(
      '🚀 ~ PaymentService ~ handleCheckoutSessionCompleted ~ orderId:',
      orderId,
    );
    if (!orderId) {
      const order = await this.orderService.findOrderBySessionId(session.id);
      if (!order) {
        throw new BadRequestException(
          'No se ha encontrado la orden asociada a la session id',
        );
      }
      orderId = order.id;
    }
    const order = await this.orderService.getOrderById(orderId);
    if (order) {
      const userId =
        typeof order.userId === 'object' ? order.userId.id : order.userId;
      await this.usersService.updateUser(userId, { isPremium: true });
    } else {
      throw new NotFoundException('No se ha encontrado la orden');
    }
  }
}
