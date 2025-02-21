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
      console.log('Processed checkout.session.completed event.');
    } else if (event.type === 'charge.updated') {
      console.log(
        'charge.updated received, ignoring until checkout.session.completed',
      );
    } else {
      console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  }
}
