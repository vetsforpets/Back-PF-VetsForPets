import {
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from '../order/order.service';
import { UsersService } from '../users/users.service';
import { Order } from '../order/entity/order.entity';
import { MembershipDto } from '../membership/dto/membership.dto';

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
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url:
          'https://front-pf-vets-for-pets-main.vercel.app/',
        cancel_url:
          'https://front-pf-vets-for-pets.vercel.app/canceled-transaction',
        metadata: {
          orderId: order.id,
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
          },
        },
      });
      await this.orderService.updateOrder(order.id, { sessionId: session.id });

      return session;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw error;
    }
  }

  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async findOrderBySessionId(sessionId: string) {
    return await this.orderService.findOrderBySessionId(sessionId);
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session | any) {
    let orderId = session.metadata?.orderId;

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
      const updateResult = await this.usersService.updateUserWithOutLocation(
        userId,
        {
          isPremium: true,
        },
      );
    } else {
      throw new NotFoundException('No se ha encontrado la orden');
    }
  }
  async constructStripeEvent(
    rawBody: string,
    signature: string,
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new BadRequestException(`Error en el webhook: ${error.message}`);
    }
  }

  async getBalanceReport(): Promise<Stripe.Balance> {
    try {
      const finance = await this.stripe.balance.retrieve();
      return finance;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se ha podido recuperar el balance desde la API de Stripe',
      );
    }
  }

  async getTransactionsReport(
    limitPage: number,
  ): Promise<Stripe.ApiList<Stripe.BalanceTransaction>> {
    try {
      const balanceTransactions = await this.stripe.balanceTransactions.list({
        limit: limitPage,
      });
      return balanceTransactions;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se ha podido recuperar el historial de transacciones desde la API de Stripe',
      );
    }
  }

  async getUsersPremium() {
    const users = await this.usersService.usersFilteredByOrder();

    const premiumUsers = users.filter((user) => user.isPremium);

    const mappedUsers = premiumUsers.map((user) => {
      let orderDate: Date | undefined;
      if (user.order) {
        orderDate = user.order.sort(
          (a, b) => b.orderDate.getTime() - a.orderDate.getTime(),
        )[0].orderDate;
      }
      return {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        orderDate,
      };
    });

    return mappedUsers;
  }
}
