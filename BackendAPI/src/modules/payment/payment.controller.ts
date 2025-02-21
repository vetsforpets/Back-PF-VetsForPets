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
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {
  private stripe: Stripe;
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('webhook')
  // @ApiBearerAuth()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    let event;
    try {
      const rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString()
        : (req.rawBody as string);
      event = JSON.parse(rawBody);
    } catch (error) {
      throw new BadRequestException(`Error en el webhook: ${error.message}`);
    }
    console.log('Event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.paymentService.handleCheckoutSessionCompleted(session);
      console.log('handleCheckoutSessionCompleted was triggered.');
    } else if (event.type === 'charge.updated') {
      const charge = event.data.object;
      console.log('Charge updated event received:', charge);
      let orderId = charge.metadata?.orderId;
      if (!orderId && charge.payment_intent) {
        try {
          const paymentIntent = await this.paymentService.getPaymentIntent(
            charge.payment_intent,
          );
          console.log(
            'Retrieved PaymentIntent metadata:',
            paymentIntent.metadata,
          );
          orderId = paymentIntent.metadata.orderId;
        } catch (error) {
          console.error('Error retrieving PaymentIntent:', error);
        }
        if (!orderId) {
          console.warn(
            'charge.updated event missing orderId in metadata even after retrieving PaymentIntent',
          );
        } else {
          await this.paymentService.handleCheckoutSessionCompleted({
            metadata: { orderId },
            id: charge.id,
          } as unknown as Stripe.Checkout.Session);
        }
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  }
}
