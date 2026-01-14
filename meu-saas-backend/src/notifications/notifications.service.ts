import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PushService } from '../push/push.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly pushService: PushService,
  ) {}

  async getAllNotifications() {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getUserNotifications(userId: string) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createNotification(notificationData: {
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
    userId?: string;
    actionUrl?: string;
  }) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .insert({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        user_id: notificationData.userId || null,
        action_url: notificationData.actionUrl || null,
        read: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Enviar notificação push se houver userId
    if (notificationData.userId) {
      this.sendPushNotification(notificationData.userId, {
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
      }).catch((err) => {
        this.logger.error('Erro ao enviar push notification:', err);
      });
    }

    return data;
  }

  private async sendPushNotification(
    userId: string,
    data: { title: string; message: string; actionUrl?: string },
  ) {
    try {
      await this.pushService.sendToUser(userId, {
        title: `🔔 ${data.title}`,
        body: data.message,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: {
          url: data.actionUrl || '/funcionario/notificacoes',
        },
      });
    } catch (error) {
      this.logger.error('Falha ao enviar push notification:', error);
    }
  }

  async markAsRead(notificationId: string) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async markAllAsRead(userId: string) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .select();

    if (error) throw new Error(error.message);
    return { message: `${data?.length || 0} notificações marcadas como lidas` };
  }

  async deleteNotification(notificationId: string) {
    const { error } = await this.supabase.client
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw new Error(error.message);
    return { message: 'Notificação excluída com sucesso' };
  }
}
