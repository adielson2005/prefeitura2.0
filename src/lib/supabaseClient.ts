import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase - Prefeitura Municipal
 * Configuração do banco de dados e autenticação
 */

// Obter variáveis de ambiente (Vite usa import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de variáveis de ambiente
if (!supabaseUrl) {
  console.error("❌ VITE_SUPABASE_URL não configurada!");
  throw new Error(
    "Configure VITE_SUPABASE_URL no arquivo .env.local\n" +
    "Exemplo: VITE_SUPABASE_URL=https://seu-projeto.supabase.co"
  );
}

if (!supabaseAnonKey) {
  console.error("❌ VITE_SUPABASE_ANON_KEY não configurada!");
  throw new Error(
    "Configure VITE_SUPABASE_ANON_KEY no arquivo .env.local\n" +
    "Obtenha em: https://app.supabase.com > Settings > API"
  );
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Tipos do banco de dados
export type UserRole = 
  | 'VIGIA'
  | 'VIGILANTE' 
  | 'GUARDA'
  | 'SUPERVISOR'
  | 'GERENTE'
  | 'ADMINISTRADOR';

export type PunchType = 
  | 'ENTRADA'
  | 'INTERVALO'
  | 'RETORNO'
  | 'SAIDA';

export type ShiftStatus = 
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'CANCELADO';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  email_institucional?: string;
  email_pessoal?: string;
  telefone_celular?: string;
  theme?: string;
  notif_email?: boolean;
  notif_push?: boolean;
  notif_sms?: boolean;
  notif_som?: boolean;
  two_factor_enabled?: boolean;
  active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimeRecord {
  id: string;
  user_id: string;
  punch_type: PunchType;
  punch_time: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  notes?: string;
  photo_url?: string;
  is_valid?: boolean;
  validated_by?: string;
  validated_at?: string;
  created_at?: string;
}

export interface Shift {
  id: string;
  user_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
  status?: ShiftStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
  read_at?: string;
  created_at?: string;
}
