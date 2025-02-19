import { BadRequestException, Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}

    @Post('webhook')
    async handleStripeWebhook(@Req()req: RawBodyRequest<Request>, @Res() res: Response){

        const sig = req.headers['stripe-signature']
        let event;
        try {
            event = await this.paymentService.constructStripeEvent(req.rawBody, sig)
        } catch (error) {
            throw new BadRequestException(`Error en el webhook: ${error.message}`);

        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            await this.paymentService.handleCheckoutSessionCompleted(session)
        }

        res.status(200).json({received: true})
    }
}
