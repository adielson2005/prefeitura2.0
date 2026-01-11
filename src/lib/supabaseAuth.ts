/**
 * Serviço de Autenticação com Supabase
 * Sistema completo de login, registro e gerenciamento de sessão
 */

import { supabase, User, UserRole } from './supabaseClient';

// Chaves do localStorage (mantém compatibilidade com sistema atual)
const STORAGE_KEYS = {
  AUTH_TOKEN: "sec_auth_token",
  USER_DATA: "sec_user_data",
  LOGIN_TIMESTAMP: "sec_login_ts",
  LAST_ACTIVITY: "sec_last_activity",
};

/**
 * Login com Supabase + Auditoria
 */
export async function loginWithSupabase(
  username: string, 
  password: string,
  loginType?: 'encarregado' | 'funcionario'
): Promise<{ success: boolean; user?: User; error?: string }> {
  const auditData: any = {
    username,
    login_type: loginType || 'direto',
    logged_in_at: new Date().toISOString()
  };

  try {
    // 1. Buscar usuário pelo username
    const { data: users, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (searchError) {
      // Registrar falha de auditoria
      await registerLoginAudit({
        ...auditData,
        success: false,
        error_message: `Erro no banco: ${searchError.message}`
      });

      console.error('Erro ao buscar usuário:', searchError);
      console.error('Detalhes completos:', JSON.stringify(searchError, null, 2));
      return { 
        success: false, 
        error: `Erro no banco: ${searchError.message || 'Erro desconhecido'}. Verifique se executou o SQL no Supabase.` 
      };
    }

    if (!users || users.length === 0) {
      // Registrar tentativa com usuário inexistente
      await registerLoginAudit({
        ...auditData,
        success: false,
        error_message: 'Usuário não encontrado'
      });

      return { success: false, error: 'Usuário não encontrado' };
    }

    const user = users[0] as User;
    auditData.user_id = user.id;
    auditData.role = user.role;

    // 2. Verificar senha (hash SHA-256)
    const passwordHash = await hashPassword(password);
    
    if (user.password_hash !== passwordHash) {
      // Registrar senha incorreta
      await registerLoginAudit({
        ...auditData,
        success: false,
        error_message: 'Senha incorreta'
      });

      return { success: false, error: 'Senha incorreta' };
    }

    // 3. Login bem-sucedido! Atualizar último login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // 4. Registrar login bem-sucedido na auditoria
    await registerLoginAudit({
      ...auditData,
      success: true
    });

    // 5. Salvar sessão no localStorage
    const sessionData = {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      email: user.email
    };

    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sessionData));
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIMESTAMP, Date.now().toString());
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `sb_${user.id}_${Date.now()}`);

    return { success: true, user };

  } catch (error) {
    // Registrar erro inesperado
    await registerLoginAudit({
      ...auditData,
      success: false,
      error_message: `Erro inesperado: ${error}`
    });

    console.error('Erro no login:', error);
    return { success: false, error: 'Erro inesperado no login' };
  }
}

/**
 * Registrar tentativa de login na auditoria
 */
async function registerLoginAudit(data: {
  user_id?: string;
  username: string;
  role?: string;
  login_type: string;
  success: boolean;
  error_message?: string;
  logged_in_at: string;
}) {
  try {
    // Coletar informações do navegador
    const userAgent = navigator.userAgent;
    const browser = getBrowserName(userAgent);
    const os = getOSName(userAgent);
    const device = getDeviceType(userAgent);

    await supabase.from('login_audit').insert({
      user_id: data.user_id || null,
      username: data.username,
      role: data.role || null,
      login_type: data.login_type,
      success: data.success,
      error_message: data.error_message || null,
      user_agent: userAgent,
      browser,
      os,
      device,
      logged_in_at: data.logged_in_at
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    // Não falhar o login se auditoria falhar
  }
}

/**
 * Detectar nome do navegador
 */
function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

/**
 * Detectar sistema operacional
 */
function getOSName(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

/**
 * Detectar tipo de dispositivo
 */
function getDeviceType(userAgent: string): string {
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

/**
 * Logout
 */
export function logout(): void {
  // Limpar localStorage
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Redirecionar para login
  window.location.href = '/login';
}

/**
 * Verificar se usuário está autenticado
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return !!(token && userData);
}

/**
 * Obter usuário atual
 */
export function getCurrentUser(): any {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Registrar novo ponto
 */
export async function registerTimeRecord(
  userId: string,
  punchType: 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA',
  location?: { latitude: number; longitude: number; name?: string },
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from('time_records')
      .insert({
        user_id: userId,
        punch_type: punchType,
        punch_time: new Date().toISOString(),
        latitude: location?.latitude,
        longitude: location?.longitude,
        location_name: location?.name,
        notes: notes
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar ponto:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao registrar ponto:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Buscar registros de ponto do usuário
 */
export async function getTimeRecords(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  try {
    let query = supabase
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
      console.error('Erro ao buscar registros:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Buscar escalas do usuário
 */
export async function getUserShifts(
  userId: string,
  month?: number,
  year?: number
) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('shift_date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar escalas:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar escalas:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Atualizar perfil do usuário
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }

    // Atualizar localStorage se necessário
    const currentUser = getCurrentUser();
    if (currentUser && data) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        ...currentUser,
        fullName: data.full_name,
        email: data.email
      }));
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Alterar senha
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    // 1. Verificar senha atual
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    const currentHash = await hashPassword(currentPassword);
    if (user.password_hash !== currentHash) {
      return { success: false, error: 'Senha atual incorreta' };
    }

    // 2. Atualizar para nova senha
    const newHash = await hashPassword(newPassword);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Gerar código de verificação
 */
export async function generateSecurityCode(
  userId: string,
  purpose: 'password_reset' | 'two_factor'
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expirar em 15 minutos
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const { error } = await supabase
      .from('security_codes')
      .insert({
        user_id: userId,
        code: code,
        purpose: purpose,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Erro ao gerar código:', error);
      return { success: false, error: error.message };
    }

    return { success: true, code };
  } catch (error) {
    console.error('Erro ao gerar código:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Validar código de verificação
 */
export async function validateSecurityCode(
  userId: string,
  code: string,
  purpose: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('security_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('purpose', purpose)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return { success: false, error: 'Código inválido ou expirado' };
    }

    // Marcar como usado
    await supabase
      .from('security_codes')
      .update({ 
        used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('id', data.id);

    return { success: true };
  } catch (error) {
    console.error('Erro ao validar código:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Hash de senha usando SHA-256
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Buscar notificações do usuário
 */
export async function getUserNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Marcar notificação como lida
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao marcar notificação:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}
