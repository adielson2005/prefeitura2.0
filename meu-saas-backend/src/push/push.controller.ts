import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PushService } from './push.service';
import { PushSubscriptionDto } from './dto/push-subscription.dto';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /**
   * Retorna a chave pública VAPID
   */
  @Get('public-key')
  getPublicKey() {
    return {
      publicKey: this.pushService.getPublicKey(),
    };
  }

  /**
   * Registra uma nova push subscription
   */
  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() dto: PushSubscriptionDto) {
    await this.pushService.subscribe(dto.userId, dto.subscription);
    return { message: 'Subscription registrada com sucesso' };
  }

  /**
   * Remove uma push subscription
   */
  @Delete('unsubscribe/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(
    @Param('userId') userId: string,
    @Body('endpoint') endpoint: string,
  ) {
    await this.pushService.unsubscribe(userId, endpoint);
  }

  /**
   * Endpoint de teste para enviar notificação
   */
  @Post('test/:userId')
  async testPush(@Param('userId') userId: string) {
    await this.pushService.sendToUser(userId, {
      title: '🔔 Notificação de Teste',
      body: 'Sistema de notificações push funcionando!',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: {
        url: '/funcionario/notificacoes',
      },
    });

    return { message: 'Notificação de teste enviada' };
  }
}
