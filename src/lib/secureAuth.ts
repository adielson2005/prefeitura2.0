/**
 * Sistema de Autenticação Seguro - Prefeitura Municipal
 *
 * ATUALIZADO: Integrado com Backend NestJS
 * Fallback para Supabase se API não estiver disponível
 */

import {
  loginWithSupabase,
  logout as supabaseLogout,
  isAuthenticated,
  getCurrentUser as getSupabaseUser,
} from "./supabaseAuth";
import { apiService } from "./apiService";

/**
 * Login (usa API backend com fallback para Supabase)
 */
export async function secureLogin(username: string, password: string) {
  try {
    // Tentar login via API backend primeiro
    const response = await apiService.login({ username, password });

    if (response.success && response.data) {
      // Salvar token e dados do usuário
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("sec_user", JSON.stringify(response.data.user));
      localStorage.setItem("sec_last_activity", Date.now().toString());

      return {
        success: true,
        user: response.data.user,
      };
    }

    throw new Error(response.error || "Erro ao fazer login");
  } catch (error) {
    console.warn("API não disponível, usando Supabase como fallback:", error);
    // Fallback para Supabase
    return await loginWithSupabase(username, password);
  }
}

/**
 * Logout (limpa token da API e Supabase)
 */
export async function secureLogout() {
  try {
    await apiService.logout();
  } catch (error) {
    console.warn("Erro ao fazer logout na API:", error);
  }

  // Limpar dados locais
  localStorage.removeItem("auth_token");
  localStorage.removeItem("sec_user");
  localStorage.removeItem("sec_last_activity");

  // Logout do Supabase também
  supabaseLogout();
}

/**
 * Verificar se sessão é válida
 */
export function isSessionValid(): boolean {
  return isAuthenticated();
}

/**
 * Obter usuário atual (com suporte a API e Supabase)
 */
export function getCurrentUser() {
  // Tentar pegar do localStorage (autenticação via API)
  const userStr = localStorage.getItem("sec_user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      // Se falhar, tentar Supabase
    }
  }

  // Fallback para Supabase
  return getSupabaseUser();
}

/**
 * Registrar atividade (manter sessão ativa)
 */
export function touchActivity() {
  localStorage.setItem("sec_last_activity", Date.now().toString());
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
