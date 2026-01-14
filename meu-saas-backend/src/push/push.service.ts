import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webPush from 'web-push';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';

export interface PushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushSubscriptionDto {
  userId: string;
  subscription: PushSubscription;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private configService: ConfigService,
  ) {
    // Configurar VAPID
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>('VAPID_SUBJECT');

    if (publicKey && privateKey && subject) {
      webPush.setVapidDetails(subject, publicKey, privateKey);
      this.logger.log('VAPID configurado com sucesso');
    } else {
      this.logger.warn('Chaves VAPID não encontradas no .env');
    }
  }

  /**
   * Registra uma nova push subscription para um usuário
   */
  async subscribe(
    userId: string,
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      // Salvar subscription no Supabase
      const { error } = await this.supabase.from('push_subscriptions').upsert(
        {
          user_id: userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          expiration_time: subscription.expirationTime,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,endpoint',
        },
      );

      if (error) {
        this.logger.error(`Erro ao salvar subscription: ${error.message}`);
        throw new Error('Falha ao salvar subscription');
      }

      this.logger.log(`Subscription registrada para usuário ${userId}`);
    } catch (error) {
      this.logger.error('Erro ao processar subscription:', error);
      throw error;
    }
  }

  /**
   * Remove uma subscription
   */
  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId)
        .eq('endpoint', endpoint);

      if (error) {
        this.logger.error(`Erro ao remover subscription: ${error.message}`);
        throw new Error('Falha ao remover subscription');
      }

      this.logger.log(`Subscription removida para usuário ${userId}`);
    } catch (error) {
      this.logger.error('Erro ao remover subscription:', error);
      throw error;
    }
  }

  /**
   * Envia notificação push para um usuário específico
   */
  async sendToUser(userId: string, payload: any): Promise<void> {
    try {
      // Buscar todas as subscriptions do usuário
      const { data: subscriptions, error } = await this.supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        this.logger.error(`Erro ao buscar subscriptions: ${error.message}`);
        return;
      }

      if (!subscriptions || subscriptions.length === 0) {
        this.logger.warn(
          `Nenhuma subscription encontrada para usuário ${userId}`,
        );
        return;
      }

      // Enviar para todas as subscriptions do usuário
      const promises = subscriptions.map((sub) => {
        const pushSubscription: PushSubscription = {
          endpoint: sub.endpoint,
          expirationTime: sub.expiration_time,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        return this.sendNotification(
          pushSubscription,
          payload,
          userId,
          sub.endpoint,
        );
      });

      await Promise.allSettled(promises);
    } catch (error) {
      this.logger.error('Erro ao enviar push para usuário:', error);
    }
  }

  /**
   * Envia notificação para uma subscription específica
   */
  private async sendNotification(
    subscription: PushSubscription,
    payload: any,
    userId: string,
    endpoint: string,
  ): Promise<void> {
    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload));
      this.logger.log(`Push enviado com sucesso para ${userId}`);
    } catch (error: any) {
      this.logger.error(`Erro ao enviar push: ${error.message}`);

      // Se a subscription expirou ou é inválida, removê-la
      if (error.statusCode === 410 || error.statusCode === 404) {
        this.logger.warn(`Subscription expirada/inválida, removendo...`);
        await this.unsubscribe(userId, endpoint);
      }
    }
  }

  /**
   * Retorna a chave pública VAPID para o frontend
   */
  getPublicKey(): string {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') || '';
  }
}
