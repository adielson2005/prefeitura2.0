/**
 * Serviço de Registro de Ponto em Tempo Real
 * Captura automática de timestamp e geolocalização
 */

import { db, TimeRecord, createAuditLog, createNotification } from './db';
import { format } from 'date-fns';

export interface ClockInData {
  professionalId: string;
  professionalName: string;
  category: 'VIGIA' | 'VIGILANTE' | 'GUARDA';
  userId: string;
  userName: string;
}

export class TimeClockService {
  /**
   * Registra entrada
   */
  async clockIn(data: ClockInData): Promise<TimeRecord> {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');

    // Verificar se já existe registro hoje
    const existing = await db.timeRecords
      .where('professionalId')
      .equals(data.professionalId)
      .and(r => r.date === today)
      .first();

    if (existing && existing.entryTime) {
      throw new Error('Entrada já registrada hoje!');
    }

    // Obter localização
    const location = await this.getCurrentLocation();

    const record: TimeRecord = {
      professionalId: data.professionalId,
      professionalName: data.professionalName,
      category: data.category,
      date: today,
      entryTime: currentTime,
      status: this.calculateStatus(currentTime, 'ENTRADA'),
      location
    };

    // Salvar no banco
    const id = await db.timeRecords.add(record);

    // Criar log de auditoria
    await createAuditLog(
      data.userId,
      data.userName,
      'REGISTRO_ENTRADA',
      'timerecord',
      id.toString(),
      { time: currentTime, professional: data.professionalName }
    );

    // Criar notificação se atrasado
    if (record.status === 'ATRASADO') {
      await createNotification(
        'Registro de Atraso',
        `${data.professionalName} registrou entrada com atraso às ${currentTime}`,
        'WARNING'
      );
    }

    return { ...record, id };
  }

  /**
   * Registra saída para almoço
   */
  async clockOutLunch(professionalId: string, userId: string, userName: string): Promise<void> {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');

    const record = await this.getTodayRecord(professionalId);
    if (!record || !record.id) {
      throw new Error('Não há registro de entrada hoje!');
    }

    if (record.lunchOutTime) {
      throw new Error('Saída para almoço já registrada!');
    }

    await db.timeRecords.update(record.id, {
      lunchOutTime: currentTime
    });

    await createAuditLog(
      userId,
      userName,
      'SAIDA_ALMOCO',
      'timerecord',
      record.id.toString(),
      { time: currentTime }
    );
  }

  /**
   * Registra retorno do almoço
   */
  async clockInLunch(professionalId: string, userId: string, userName: string): Promise<void> {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');

    const record = await this.getTodayRecord(professionalId);
    if (!record || !record.id) {
      throw new Error('Não há registro de entrada hoje!');
    }

    if (!record.lunchOutTime) {
      throw new Error('Não há registro de saída para almoço!');
    }

    if (record.lunchReturnTime) {
      throw new Error('Retorno do almoço já registrado!');
    }

    await db.timeRecords.update(record.id, {
      lunchReturnTime: currentTime
    });

    await createAuditLog(
      userId,
      userName,
      'RETORNO_ALMOCO',
      'timerecord',
      record.id.toString(),
      { time: currentTime }
    );
  }

  /**
   * Registra saída
   */
  async clockOut(professionalId: string, userId: string, userName: string): Promise<void> {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');

    const record = await this.getTodayRecord(professionalId);
    if (!record || !record.id) {
      throw new Error('Não há registro de entrada hoje!');
    }

    if (record.exitTime) {
      throw new Error('Saída já registrada!');
    }

    await db.timeRecords.update(record.id, {
      exitTime: currentTime,
      status: 'COMPLETO'
    });

    await createAuditLog(
      userId,
      userName,
      'REGISTRO_SAIDA',
      'timerecord',
      record.id.toString(),
      { time: currentTime }
    );
  }

  /**
   * Obtém registro de hoje
   */
  private async getTodayRecord(professionalId: string): Promise<TimeRecord | undefined> {
    const today = format(new Date(), 'yyyy-MM-dd');
    return await db.timeRecords
      .where('professionalId')
      .equals(professionalId)
      .and(r => r.date === today)
      .first();
  }

  /**
   * Calcula status baseado no horário
   */
  private calculateStatus(time: string, type: 'ENTRADA' | 'SAIDA'): TimeRecord['status'] {
    if (type === 'ENTRADA') {
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const cutoffMinutes = 8 * 60; // 08:00

      if (totalMinutes > cutoffMinutes) {
        return 'ATRASADO';
      }
    }
    return 'EM_ANDAMENTO';
  }

  /**
   * Obtém localização atual (GPS)
   */
  private async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | undefined> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          // Em caso de erro, retorna undefined
          resolve(undefined);
        },
        { timeout: 5000 }
      );
    });
  }

  /**
   * Obtém todos os registros de um período
   */
  async getRecordsByDateRange(startDate: string, endDate: string): Promise<TimeRecord[]> {
    return await db.timeRecords
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  /**
   * Obtém registros de um profissional
   */
  async getRecordsByProfessional(professionalId: string, limit = 30): Promise<TimeRecord[]> {
    return await db.timeRecords
      .where('professionalId')
      .equals(professionalId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Adiciona nota/observação a um registro
   */
  async addNote(recordId: number, note: string, userId: string, userName: string): Promise<void> {
    await db.timeRecords.update(recordId, { notes: note });

    await createAuditLog(
      userId,
      userName,
      'ADICIONAR_NOTA',
      'timerecord',
      recordId.toString(),
      { note }
    );
  }
}

export const timeClockService = new TimeClockService();
