/**
 * Sistema de Banco de Dados com IndexedDB usando Dexie
 * Persistência robusta que não se perde ao limpar navegador
 */

import Dexie, { Table } from 'dexie';
import type { Professional, Activity, Leave, Area } from './dataService';

export interface TimeRecord {
  id?: number;
  professionalId: string;
  professionalName: string;
  category: 'VIGIA' | 'VIGILANTE' | 'GUARDA';
  date: string; // YYYY-MM-DD
  entryTime?: string;
  lunchOutTime?: string;
  lunchReturnTime?: string;
  exitTime?: string;
  status: 'COMPLETO' | 'EM_ANDAMENTO' | 'ATRASADO' | 'AUSENTE';
  location?: { latitude: number; longitude: number };
  notes?: string;
}

export interface User {
  id?: number;
  username: string;
  passwordHash: string;
  role: 'ADMINISTRADOR' | 'GERENTE' | 'SUPERVISOR';
  fullName: string;
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id?: number;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  timestamp: Date;
  ipAddress?: string;
}

export interface Notification {
  id?: number;
  userId?: string; // se null, é para todos
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface FileUpload {
  id?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  base64Data: string;
  uploadedBy: string;
  uploadedAt: Date;
  entityType: string; // 'professional', 'timerecord', etc
  entityId: string;
}

class VigiaDB extends Dexie {
  professionals!: Table<Professional & { id: string }>;
  activities!: Table<Activity & { id: string }>;
  leaves!: Table<Leave & { id: string }>;
  areas!: Table<Area & { id: string }>;
  timeRecords!: Table<TimeRecord>;
  users!: Table<User>;
  auditLogs!: Table<AuditLog>;
  notifications!: Table<Notification>;
  fileUploads!: Table<FileUpload>;

  constructor() {
    super('VigiaDatabase');
    
    this.version(1).stores({
      professionals: 'id, name, category, area, status',
      activities: 'id, date, type, name, area',
      leaves: 'id, professionalId, date, approved',
      areas: 'id, name, supervisor',
      timeRecords: '++id, professionalId, date, status',
      users: '++id, username, role, active',
      auditLogs: '++id, userId, timestamp, entity',
      notifications: '++id, userId, read, createdAt, type',
      fileUploads: '++id, entityType, entityId, uploadedAt'
    });
  }
}

export const db = new VigiaDB();

// Funções auxiliares
export async function initializeDatabase() {
  const count = await db.professionals.count();
  
  if (count === 0) {
    // Migrar dados do localStorage para IndexedDB
    const storedData = localStorage.getItem('sistema_profissionais');
    if (storedData) {
      const data = JSON.parse(storedData);
      await db.professionals.bulkAdd(data);
    }
    
    // Migrar outras tabelas
    const activities = localStorage.getItem('sistema_atividades');
    if (activities) {
      await db.activities.bulkAdd(JSON.parse(activities));
    }
    
    const leaves = localStorage.getItem('sistema_folgas');
    if (leaves) {
      await db.leaves.bulkAdd(JSON.parse(leaves));
    }
    
    const areas = localStorage.getItem('sistema_areas');
    if (areas) {
      await db.areas.bulkAdd(JSON.parse(areas));
    }
  }
}

// Logs de auditoria
export async function createAuditLog(
  userId: string,
  userName: string,
  action: string,
  entity: string,
  entityId: string,
  changes?: any
) {
  await db.auditLogs.add({
    userId,
    userName,
    action,
    entity,
    entityId,
    changes,
    timestamp: new Date()
  });
}

// Notificações
export async function createNotification(
  title: string,
  message: string,
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS',
  userId?: string,
  actionUrl?: string
) {
  await db.notifications.add({
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date(),
    actionUrl
  });
}

export async function getUnreadNotifications(userId?: string) {
  if (userId) {
    return await db.notifications
      .where('userId').equals(userId)
      .and(n => n.read === false)
      .reverse()
      .sortBy('createdAt');
  }
  return await db.notifications
    .where('read').equals(0 as any)
    .reverse()
    .sortBy('createdAt');
}

export async function markNotificationAsRead(id: number) {
  await db.notifications.update(id, { read: true });
}
