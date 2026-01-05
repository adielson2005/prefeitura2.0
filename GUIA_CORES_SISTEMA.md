# 🎨 Guia de Cores do Sistema - Referência Rápida

## Regras Fixas de Cores

### ✅ Verde (Emerald)
**Significado:** Positivo / Ativo / Sucesso  
**Quando usar:**
- Status "Em Serviço"
- Confirmações
- Aprovações
- Estados ativos
- Métricas positivas

**Classes Tailwind:**
```
emerald-300, emerald-400, emerald-500, emerald-600
bg-emerald-500/30, text-emerald-300, border-emerald-500/50
```

---

### ⚠️ Amarelo/Âmbar (Amber)
**Significado:** Atenção / Aviso / Moderado  
**Quando usar:**
- Atrasados
- Folgas
- Pendências
- Avisos
- Estados que requerem atenção (não críticos)

**Classes Tailwind:**
```
amber-300, amber-400, amber-500, amber-600
bg-amber-500/30, text-amber-300, border-amber-500/50
```

---

### 🔴 Vermelho (Red)
**Significado:** Crítico / Erro / Urgente  
**Quando usar:**
- Alertas críticos
- Ausências
- Erros
- Falhas
- Estados que exigem ação imediata

**Classes Tailwind:**
```
red-300, red-400, red-500, red-600
bg-red-500/30, text-red-300, border-red-500/50
```

---

### 🟣 Roxo/Violeta (Violet)
**Significado:** Institucional / Principal / Branding  
**Quando usar:**
- Elementos de identidade da prefeitura
- Cards KPI principais
- Navegação ativa
- Logo e branding
- Elementos de destaque institucional

**Classes Tailwind:**
```
violet-300, violet-400, violet-500, violet-600
bg-violet-500/30, text-violet-300, border-violet-500/50
```

---

### ⚪ Cinza (Slate)
**Significado:** Neutro / Inativo / Desabilitado  
**Quando usar:**
- Estados inativos
- Elementos desabilitados
- "Aguardando..."
- Background neutro
- Texto secundário

**Classes Tailwind:**
```
slate-300, slate-400, slate-500, slate-600
bg-slate-500/30, text-slate-300, border-slate-500/50
```

---

## Mapeamento Rápido

| Status | Cor | Razão |
|--------|-----|-------|
| Em Serviço | 🟢 Verde | Ativo/Positivo |
| Atrasado | 🟡 Amarelo | Atenção |
| Folga | 🟡 Amarelo | Atenção (não disponível) |
| Ausente | 🔴 Vermelho | Crítico |
| Total Profissionais | 🟣 Roxo | Institucional |
| Alertas | 🔴 Vermelho | Crítico |
| Aguardando | ⚪ Cinza | Neutro |

---

## Exemplos de Uso

### Card de Status
```tsx
// ✅ CORRETO
<Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50">
  Em Serviço
</Badge>

// ❌ INCORRETO (não usar verde para folga)
<Badge className="bg-emerald-500/30 text-emerald-300">
  Folga
</Badge>
```

### Botão de Ação
```tsx
// ✅ CORRETO - Ação principal (entrada)
<Button className="bg-gradient-to-r from-emerald-600 to-emerald-500">
  REGISTRAR ENTRADA
</Button>

// ✅ CORRETO - Ação crítica (logout)
<Button className="bg-gradient-to-r from-red-600 to-red-500">
  Sair
</Button>
```

### Cards KPI
```tsx
// ✅ CORRETO
variant="primary"    // Roxo - Total Profissionais
variant="success"    // Verde - Em Serviço
variant="warning"    // Amarelo - Folgas
variant="danger"     // Vermelho - Alertas
```

---

## Benefícios

1. **Escaneabilidade:** Cores consistentes facilitam reconhecimento instantâneo
2. **Escalabilidade:** Novos componentes seguem regras claras
3. **Acessibilidade:** Cores não são única forma de comunicação (sempre há texto/ícone)
4. **Profissionalismo:** Sistema coeso e bem pensado

---

## Arquivo de Referência

Todas as definições estão em: `src/lib/statusColors.ts`

Use o helper `getStatusClasses(status)` para obter classes automaticamente:

```tsx
import { getStatusClasses } from "@/lib/statusColors";

const classes = getStatusClasses("EM_SERVICO");
// Retorna: { badge: "...", button: "...", border: "...", etc }
```

---

**Última atualização:** 04/01/2026  
**Mantido por:** Sistema de Design da Prefeitura
