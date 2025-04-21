import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public-routes/public-routes.decorator';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBadRequestResponse({ description: 'La informacion enviada es invalida ' })
  @ApiOperation({ summary: 'Webhook de Stripe' })
  @ApiOkResponse({ description: 'Webhook recibido con éxito' })
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
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  }

  @Public()
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la API de Stripe',
  })
  @ApiOperation({ summary: 'Obtener reporte de balance administrativo' })
  @ApiOkResponse({ description: 'Reporte de balance obtenido con éxito' })
  @Get('admin/reports/balance')
  adminBalanceRecord() {
    try {
      return this.paymentService.getBalanceReport();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Se ha encontrado un error desde el lado del cliente ${error.message}`,
      );
    }
  }

  @Public()
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la API de Stripe',
  })
  @ApiOperation({ summary: 'Obtener reporte de transacciones administrativas' })
  @ApiOkResponse({ description: 'Reporte de transacciones obtenido con éxito' })
  @Get('admin/reports/transactions')
  adminBalanceTransactions(@Param() limitPage: number) {
    try {
      return this.paymentService.getTransactionsReport(limitPage);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        `Se ha encontrado un error desde el lado del cliente ${error.message}`,
      );
    }
  }

  @Public()
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la API de Stripe',
  })
  @ApiOperation({ summary: 'Obtener conteo de usuarios premium administrativo' })
  @ApiOkResponse({ description: 'Conteo de usuarios premium obtenido con éxito' })
  @Get('admin/reports/premium')
  adminUsersPremiumCount() {
    try {
      return this.paymentService.getUsersPremium();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        `Se ha encontrado un error desde el lado del cliente ${error.message}`,
      );
    }
  }
}