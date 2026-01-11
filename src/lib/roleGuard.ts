/**
 * Sistema de Controle de Acesso Baseado em Roles (RBAC)
 * Gerencia permissões e redirecionamento baseado no papel do usuário
 */

export type UserRole = 
  | 'VIGIA' 
  | 'VIGILANTE' 
  | 'GUARDA' 
  | 'SUPERVISOR' 
  | 'COORDENADOR' 
  | 'ADMIN'
  | 'GERENTE'
  | 'ADMINISTRADOR';

export type ModuleType = 'admin' | 'employee';

// Mapeamento de roles para módulos
const ROLE_MODULE_MAP: Record<UserRole, ModuleType> = {
  // Funcionários operacionais -> Portal do Funcionário
  VIGIA: 'employee',
  VIGILANTE: 'employee',
  GUARDA: 'employee',
  
  // Gestão -> Painel Administrativo
  SUPERVISOR: 'admin',
  COORDENADOR: 'admin',
  ADMIN: 'admin',
  GERENTE: 'admin',
  ADMINISTRADOR: 'admin',
};

// Rotas permitidas por módulo
const MODULE_ROUTES = {
  admin: [
    '/',
    '/vigias',
    '/vigilantes',
    '/guardas',
    '/ponto',
    '/escalas',
    '/areas',
    '/supervisores',
    '/relatorios',
    '/configuracoes',
    '/perfil',
    '/notificacoes',
    '/seguranca',
    '/buscar',
  ],
  employee: [
    '/funcionario',
    '/funcionario/ponto',
    '/funcionario/escala',
    '/funcionario/historico',
    '/funcionario/notificacoes',
    '/funcionario/perfil',
  ],
};

/**
 * Retorna o módulo (admin ou employee) baseado no role do usuário
 */
export function getModuleByRole(role: UserRole): ModuleType {
  return ROLE_MODULE_MAP[role] || 'employee';
}

/**
 * Verifica se o usuário tem permissão para acessar determinada rota
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  const module = getModuleByRole(role);
  const allowedRoutes = MODULE_ROUTES[module];
  
  // Verifica se a rota começa com alguma rota permitida
  return allowedRoutes.some(allowedRoute => 
    route === allowedRoute || route.startsWith(allowedRoute + '/')
  );
}

/**
 * Retorna a rota inicial (dashboard) baseada no role
 */
export function getDefaultRoute(role: UserRole): string {
  const module = getModuleByRole(role);
  return module === 'admin' ? '/' : '/funcionario';
}

/**
 * Verifica se o role é administrativo
 */
export function isAdminRole(role: UserRole): boolean {
  return getModuleByRole(role) === 'admin';
}

/**
 * Verifica se o role é operacional (funcionário)
 */
export function isEmployeeRole(role: UserRole): boolean {
  return getModuleByRole(role) === 'employee';
}

/**
 * Formata o nome do role para exibição
 */
export function formatRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    VIGIA: 'Vigia',
    VIGILANTE: 'Vigilante',
    GUARDA: 'Guarda Municipal',
    SUPERVISOR: 'Supervisor',
    COORDENADOR: 'Coordenador',
    ADMIN: 'Administrador',
    GERENTE: 'Gerente',
    ADMINISTRADOR: 'Administrador',
  };
  
  return roleNames[role] || role;
}
