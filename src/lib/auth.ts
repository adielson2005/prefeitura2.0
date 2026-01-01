const AUTH_TOKEN_KEY = "authToken";
const AUTH_EMAIL_KEY = "userEmail";
const AUTH_TS_KEY = "authTimestamp";
const LAST_ACTIVITY_KEY = "lastActivity";

// Padrões: inatividade 30 minutos, expiração absoluta 24 horas
const DEFAULT_INACTIVITY_MINUTES = 30;
const DEFAULT_ABSOLUTE_HOURS = 24;

export function login(token: string, email?: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (email) localStorage.setItem(AUTH_EMAIL_KEY, email);
  const now = Date.now().toString();
  localStorage.setItem(AUTH_TS_KEY, now);
  localStorage.setItem(LAST_ACTIVITY_KEY, now);
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(AUTH_TS_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function touch() {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

export function getUserEmail() {
  return localStorage.getItem(AUTH_EMAIL_KEY) || undefined;
}

/**
 * Verifica se há token e se não expirou por inatividade e expiração absoluta.
 * @param inactivityMinutes tempo em minutos de inatividade até expirar (padrão 30)
 * @param absoluteHours expiração absoluta em horas desde login (padrão 24)
 */
export function isAuthenticated(inactivityMinutes = DEFAULT_INACTIVITY_MINUTES, absoluteHours = DEFAULT_ABSOLUTE_HOURS) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;

  const authTs = Number(localStorage.getItem(AUTH_TS_KEY) || 0);
  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || authTs || 0);
  if (!authTs || !last) return false;

  const now = Date.now();

  // Expiração absoluta
  const absDiff = now - authTs;
  if (absDiff > absoluteHours * 60 * 60 * 1000) {
    logout();
    return false;
  }

  // Inatividade
  const inactivityDiff = now - last;
  if (inactivityDiff > inactivityMinutes * 60 * 1000) {
    logout();
    return false;
  }

  return true;
}

export default {
  login,
  logout,
  touch,
  isAuthenticated,
  getUserEmail,
};
