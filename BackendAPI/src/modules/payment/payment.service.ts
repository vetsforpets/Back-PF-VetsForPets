import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { MembershipDto } from '../membership/dto/membership.dto';
import { Order } from '../order/entity/order.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
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
          unit_amount: item.price * 100,
        },
        quantity: 1,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url:
          'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
        metadata: {
          orderId: order.id,
        },
      });
      return session;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw error;
    }
  }
}
