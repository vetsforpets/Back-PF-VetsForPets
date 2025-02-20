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
    let event;
    try {
      event = JSON.parse(req.rawBody.toString());
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        await this.paymentService.handleCheckoutSessionCompleted(session);
      }
      // event = this.paymentService.constructStripeEvent(req.rawBody, sig);
    } catch (error) {
      throw new BadRequestException(`Error en el webhook: ${error.message}`);
    }

    res.status(200).json({ received: true });
  }
}
