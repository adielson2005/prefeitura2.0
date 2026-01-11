/**
 * Sistema de Autenticação Seguro - Prefeitura Municipal
 * 
 * ATUALIZADO: Agora usa Supabase como backend principal
 * Mantém compatibilidade com sistema legado
 */

import { 
  loginWithSupabase, 
  logout as supabaseLogout, 
  isAuthenticated, 
  getCurrentUser as getSupabaseUser 
} from './supabaseAuth';

/**
 * Login (migrado para Supabase)
 */
export async function secureLogin(username: string, password: string) {
  return await loginWithSupabase(username, password);
}

/**
 * Logout (migrado para Supabase)
 */
export function secureLogout() {
  supabaseLogout();
}

/**
 * Verificar se sessão é válida
 */
export function isSessionValid(): boolean {
  return isAuthenticated();
}

/**
 * Obter usuário atual
 */
export function getCurrentUser() {
  return getSupabaseUser();
}

/**
 * Registrar atividade (manter sessão ativa)
 */
export function touchActivity() {
  localStorage.setItem('sec_last_activity', Date.now().toString());
}

/**
 * Funções legadas mantidas para compatibilidade
 */
export function getRemainingAttempts(): number {
  return 5; // Sem rate limiting local agora
}

export function resetLockout(): void {
  // Não faz nada - controle no backend
}
