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

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  @ApiBearerAuth()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const sigHeader = req.headers['stripe-signature'];
    if (!sigHeader) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const sig = sigHeader.toString();
    let event;
    try {
      event = this.paymentService.constructStripeEvent(req.rawBody, sig);
    } catch (error) {
      throw new BadRequestException(`Error en el webhook: ${error.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      await this.paymentService.handleCheckoutSessionCompleted(session);
    }

    res.status(200).json({ received: true });
  }
}
