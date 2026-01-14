import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TimeRecordsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly notificationsService: NotificationsService,
  ) {}

  async registerPunch(
    userId: string,
    punchType: 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA',
    location?: {
      latitude: number;
      longitude: number;
      name?: string;
    },
    notes?: string,
  ) {
    const { data, error } = await this.supabase
      .from('time_records')
      .insert({
        user_id: userId,
        punch_type: punchType,
        punch_time: new Date().toISOString(),
        location_lat: location?.latitude || null,
        location_lng: location?.longitude || null,
        location_name: location?.name || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao registrar ponto: ${error.message}`);
    }

    return data;
  }

  async getUserRecords(userId: string, startDate?: Date, endDate?: Date) {
    let query = this.supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .order('punch_time', { ascending: false });

    if (startDate) {
      query = query.gte('punch_time', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('punch_time', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar registros: ${error.message}`);
    }

    return data;
  }

  async getAllRecords(startDate?: Date, endDate?: Date) {
    let query = this.supabase
      .from('time_records')
      .select(
        `
        *,
        users:user_id (
          id,
          username,
          full_name,
          role
        )
      `,
      )
      .order('punch_time', { ascending: false });

    if (startDate) {
      query = query.gte('punch_time', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('punch_time', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar registros: ${error.message}`);
    }

    return data;
  }

  async getTodayStats(userId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let query = this.supabase
      .from('time_records')
      .select('*', { count: 'exact' })
      .gte('punch_time', today.toISOString())
      .lt('punch_time', tomorrow.toISOString());

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    return {
      total: count || 0,
      records: data || [],
    };
  }

  async approveRecord(recordId: string, approverId: string, notes?: string) {
    const { data, error } = await this.supabase
      .from('time_records')
      .update({
        status: 'APPROVED',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        approval_notes: notes || null,
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao aprovar registro: ${error.message}`);
    }

    // Enviar notificação para o funcionário
    try {
      await this.notificationsService.createNotification({
        title: 'Ponto Aprovado',
        message: notes
          ? `Seu registro de ponto foi aprovado. Observação: ${notes}`
          : 'Seu registro de ponto foi aprovado.',
        type: 'SUCCESS',
        userId: data.user_id,
        actionUrl: '/historico',
      });
    } catch (notifError) {
      console.error('Erro ao enviar notificação:', notifError);
    }

    return data;
  }

  async rejectRecord(recordId: string, approverId: string, reason: string) {
    const { data, error } = await this.supabase
      .from('time_records')
      .update({
        status: 'REJECTED',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        approval_notes: reason,
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao rejeitar registro: ${error.message}`);
    }

    // Enviar notificação para o funcionário
    try {
      await this.notificationsService.createNotification({
        title: 'Ponto Rejeitado',
        message: `Seu registro de ponto foi rejeitado. Motivo: ${reason}`,
        type: 'WARNING',
        userId: data.user_id,
        actionUrl: '/historico',
      });
    } catch (notifError) {
      console.error('Erro ao enviar notificação:', notifError);
    }

    return data;
  }
}
