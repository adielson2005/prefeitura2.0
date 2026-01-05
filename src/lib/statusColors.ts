/**
 * Sistema de Cores Padronizado - Prefeitura Vigilância
 * 
 * Definições fixas para garantir consistência visual em todo o sistema.
 * Evita confusão no crescimento do sistema.
 * 
 * Data: 04/01/2026
 */

export const statusColors = {
  // ✅ VERDE → Positivo / Ativo / Sucesso
  positive: {
    light: "emerald-400",
    base: "emerald-500",
    dark: "emerald-600",
    gradient: "from-emerald-600/80 to-green-700/80",
    bg: "bg-emerald-500/30",
    text: "text-emerald-300",
    border: "border-emerald-500/50",
    shadow: "shadow-emerald-500/40",
    // Casos de uso: Em Serviço, Confirmado, Aprovado, Ativo
  },

  // ⚠️ AMARELO/ÂMBAR → Atenção / Aviso / Moderado
  warning: {
    light: "amber-400",
    base: "amber-500",
    dark: "amber-600",
    gradient: "from-amber-500/80 to-orange-600/80",
    bg: "bg-amber-500/30",
    text: "text-amber-300",
    border: "border-amber-500/50",
    shadow: "shadow-amber-500/40",
    // Casos de uso: Atrasado, Folga, Pendente, Atenção Necessária
  },

  // 🔴 VERMELHO → Crítico / Erro / Urgente
  critical: {
    light: "red-400",
    base: "red-500",
    dark: "red-600",
    gradient: "from-red-600/80 to-rose-700/80",
    bg: "bg-red-500/30",
    text: "text-red-300",
    border: "border-red-500/50",
    shadow: "shadow-red-500/40",
    // Casos de uso: Alertas, Ausente, Erro, Falha, Crítico
  },

  // 🟣 ROXO/VIOLETA → Neutro / Institucional / Principal
  institutional: {
    light: "violet-400",
    base: "violet-500",
    dark: "violet-600",
    gradient: "from-violet-600/80 to-purple-700/80",
    bg: "bg-violet-500/30",
    text: "text-violet-300",
    border: "border-violet-500/50",
    shadow: "shadow-violet-500/40",
    // Casos de uso: Branding, Total de Profissionais, Elementos Principais
  },

  // ⚪ CINZA → Inativo / Neutro / Desabilitado
  neutral: {
    light: "slate-400",
    base: "slate-500",
    dark: "slate-600",
    gradient: "from-slate-600 to-slate-700",
    bg: "bg-slate-500/30",
    text: "text-slate-300",
    border: "border-slate-500/50",
    shadow: "shadow-slate-500/20",
    // Casos de uso: Aguardando, Não aplicável, Desabilitado
  },
} as const;

/**
 * Mapeamento de status do sistema para cores
 */
export const statusToColor = {
  // Status de presença
  EM_SERVICO: statusColors.positive,
  ATRASADO: statusColors.warning,
  AUSENTE: statusColors.critical,
  FOLGA: statusColors.warning,

  // Status de ação
  ATIVO: statusColors.positive,
  PENDENTE: statusColors.warning,
  ERRO: statusColors.critical,
  CONCLUIDO: statusColors.positive,

  // Status institucional
  NORMAL: statusColors.institutional,
  CRITICO: statusColors.critical,
  ATENCAO: statusColors.warning,
} as const;

/**
 * Helpers para construir classes Tailwind dinâmicamente
 */
export const getStatusClasses = (status: keyof typeof statusToColor) => {
  const colors = statusToColor[status] || statusColors.neutral;
  
  return {
    badge: `${colors.bg} ${colors.text} ${colors.border}`,
    button: `bg-gradient-to-r ${colors.gradient} text-white shadow-xl ${colors.shadow}`,
    border: colors.border,
    text: colors.text,
    shadow: colors.shadow,
  };
};
