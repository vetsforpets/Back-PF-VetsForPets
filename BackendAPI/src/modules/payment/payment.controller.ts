import {
  BadRequestException,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {

  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    let event;
    const rawBody = Buffer.isBuffer(req.rawBody)
      ? req.rawBody.toString()
      : (req.rawBody as string);
    try {
      event = await this.paymentService.constructStripeEvent(
        rawBody,
        signature.toString(),
      );
    } catch (error) {
      throw new BadRequestException(`Error en el webhook: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.paymentService.handleCheckoutSessionCompleted(session);
    } else if (event.type === 'charge.updated') {
      const charge = event.data.object;
      let orderId = charge.metadata?.orderId;
      if (!orderId && charge?.payment_intent) {
        try {
          const paymentIntent = await this.paymentService.getPaymentIntent(
            charge.payment_intent,
          );
          orderId = paymentIntent.metadata.orderId;
        } catch (error) {
          console.error('Error retrieving PaymentIntent:', error);
        }
      }
      if (!orderId) {
        try {
          const order = await this.paymentService.findOrderBySessionId(
            charge.id,
          );
          if (order) {
            orderId = order.id;
          }
        } catch (error) {
          console.error('Error during fallback order lookup:', error);
        }
      }
      if (!orderId) {
        console.warn(
          'charge.updated event missing orderId in metadata and fallback did not find an order. Proceeding without update.',
        );
      } else {
        await this.paymentService.handleCheckoutSessionCompleted({
          metadata: { orderId },
          id: charge.id,
        } as unknown as Stripe.Checkout.Session);
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  }
}
